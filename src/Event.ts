
export interface Period 
{
    start: Date;
    end: Date;
}

export class Event
{

    data: any;

    parent: Event_Container;

    constructor(data: any, parent: Event_Container)
    {
        this.data = data;
        this.parent = parent;
    }

    Display(): HTMLElement
    {
        let event = document.createElement("div");

        event.classList.add("event");

        let title = this.data.summary
        
        event.createEl("p", { text: title });
        event.createEl("p", { text: this.data.recurringEventId }).style.userSelect="all";

        return event;
    }

}

export type Modifier = (event: any) => any;

export class Event_Container
{

    parent: any;
    title: string;
    period: Period;
    modifier: Modifier | null;
    
    events: Array<Event>;

    container: HTMLElement;

    constructor(parent: any, title: string, period: Period, modifier: Modifier | null = null)
    {

        this.parent = parent;
        this.title = title;
        this.period = period;
        this.modifier = modifier;

        this.events = new Array<Event>();

    }

    async Load()
    {

        const { getEvents } = this.parent.api;
    
        let calendars_ids = new Array<any>();

        this.parent.calendars.forEach((calendar: any) => 
        {
            calendars_ids.push(calendar.id);
        });
 
        const events = await getEvents({ startDate: window.moment(this.period.start), endDate: window.moment(this.period.end), include: calendars_ids });

        // Clears old events
        this.events.length = 0
        
        function is_json_string(str: string) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        if (this.modifier)
        {

            let tasks = new Array<Promise<any>>();

            for (let event of events) {
                const task: Promise<any> = new Promise(async (resolve, reject) => {
                    try {
                        if (!this || !this.modifier) {
                            throw new Error("Modifier or context is missing");
                        }

                        let modified = await this.modifier(event);

                        if (modified != null 
                            && is_json_string(modified?.description) 
                            && JSON.parse(modified?.description).version) 
                        {
                            this.events.push(new Event(modified, this));
                        }

                        resolve("success");
                    } catch (error) {
                        reject(error);
                    }
                });

                tasks.push(task);
            }

            try {
                await Promise.all(tasks);
                // console.log("All tasks completed successfully.");
            } catch (error) {
                console.error("One or more tasks failed:", error);
            }

        }
        else
        {
            for (let event of events)
            {
                let new_event = new Event(event, this);
                if (is_json_string(new_event.data?.description) 
                    && JSON.parse(new_event.data?.description).version)
                {
                    this.events.push(new Event(event, this));
                }
            }
        }
        
    }
            
    Display(): HTMLElement
    {

        if (!this.container)
            this.container = document.createElement("div");
        else
            this.container.empty()

        this.container.classList.add("event_container")

        this.container.createEl("h1", { cls: "title", text: this.title });
    
        let daily_events_block = this.container.createDiv({ cls: "event_block" });

        for (let event of this.events)
        {
            daily_events_block.appendChild(event.Display());
        }

        return this.container;
 
    } 

}