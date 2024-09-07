
interface Period 
{
    start: Date;
    end: Date;
}

export class Event
{

    data: any;

    parent: Event_List;

    constructor(data: any, parent: Event_List)
    {
        this.data = data;
        this.parent = parent;
    }

    async Display(): Promise<HTMLElement> 
    {
        let element = document.createElement("div");

        element.classList.add("event");

        element.createEl("p", { text: this.data.summary });

        return element;
    }

}

export type Modifier = (event: any) => boolean;

export class Event_List
{

    api: any;
    period: Period;
    calendars: Array<any>;
    modifier: Modifier | null;

    events: Array<Event>;

    constructor(api: any, start: Date, end: Date, calendars: Array<any>, modifier: Modifier | null = null)
    {

        this.api = api;
        this.period = { start, end };
        this.calendars = calendars;
        this.modifier = modifier;

        this.events = new Array<Event>();

        console.log(this.period.start.toString() + " - " + this.period.end.toString());

    }

    async Load()
    {

        const { getEvents } = this.api;
    
        let calendars_ids: Array<any>;

        this.calendars.forEach((calendar: any) => 
        {
            calendars_ids.push(calendar.id);
        });
 
        // @ts-ignore
        const events = await getEvents({ startDate: window.moment(this.period.start), endDate: window.moment(this.period.end), include: calendars_ids });

        // Clears old events
        this.events.length = 0

        events.forEach((element: any) => 
        {
            if (this.modifier)
            {
                let modified = this.modifier(element);
                if (modified != null)
                    this.events.push(new Event(modified, this));
            }
            else
            {
                this.events.push(new Event(element, this));
            }
        });
        
    }
            
    Display(): HTMLElement
    {

        let element = document.createElement("div");

        for (let event of this.events)
        {
            let load = async () =>
            {
                element.appendChild(await event.Display());
            }
            load()
        }

        return element;

    }

}

export class Event_Container
{

    event_list: Event_List | null;

    constructor(event_list: Event_List | null = null)
    {
        this.event_list = event_list
    }

    Display(): HTMLElement
    {

        let container = document.createElement("div");
        container.classList.add("event_container")
        
        container.createEl("h1", { cls: "title", text: "Daily" });
    
        let daily_events_block = container.createDiv({ cls: "event_block" });

        if (this.event_list)
        {
            container.appendChild(this.event_list.Display());
        }

        return container;

    }

}