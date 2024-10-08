import { ItemView, WorkspaceLeaf, Menu } from "obsidian";

import { Event, Period, Event_Container, Modifier } from "src/Event"
import { Create_Event_Modal } from "src/Create_Event";
import { waitForDebugger } from "inspector";

function Week_Period()
{
    let current = new Date();

    // Monday based days
    function week_day(date: Date) : number
    {
        let std_day = date.getDay()
        return (std_day == 0)? 6 : std_day - 1
    }

    const day_time = 86400000;

    let first = current.getTime() - ((week_day(current)) * day_time);
    let last = first + (6 * day_time);

    let start = new Date(first);
    start.setHours(0, 0, 0, 0);
    let end = new Date(last);
    end.setHours(0, 0, 0, day_time - 1);

    return { start, end };
}

function Today_Period()
{
    let current = new Date();

    const day_time = 86400000;

    let start = new Date(current);
    start.setHours(0, 0, 0, 0);
    let end = new Date(current);
    end.setHours(0, 0, 0, day_time - 1);

    return { start, end };
}

export const VIEW_CALENDAR_VIEW = "calendar-view";

export class Calendar_View extends ItemView {

    api: any;
    calendars: Array<any>;

    daily_events: Event_Container;
    weekly_events: Event_Container;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }
    
    getViewType() {
        return VIEW_CALENDAR_VIEW;
    }
    
    getDisplayText() {
        return "Calendar View";
    }
    
    async load_data()
    {

        const { getCalendars } = this.api;

        let calendars = await getCalendars();

        calendars.forEach(async (calendar: any) => {
            if (calendar.summary == "Uppgifter")
            {
                this.calendars.push(calendar);
            }
        });

        var daily_task = this.daily_events.Load();
        var weekly_task = this.weekly_events.Load();

        await Promise.all([daily_task, weekly_task]);
    }

    unique_events: Array<String>;

    async init_load_data()
    {

        console.log("Load data");

        const { getEvent } = this.api;

        this.daily_events = new Event_Container(this, "Daily", Today_Period(), 
        (event: any) =>
        {
            if (event.eventType == "multiDay")
                return null;
            return event;
        });

        // Potential issue
        this.unique_events = new Array<String>;
        this.weekly_events = new Event_Container(this, "Weekly", Week_Period(), 
        async (event: any) =>
        {
            if (event.eventType != "multiDay")
                return null;
            if (this.unique_events.includes(event.etag))
                return null;
            this.unique_events.push(event.etag);

            let real_event = await getEvent(event.id)

            return real_event;
        });

        await this.load_data();

    }

    async add_event()
    {

        new Create_Event_Modal(this.app, this.api).open();

    }

    set_up()
    {

        console.log("Set up")

        const container = this.containerEl.children[1];
        container.empty();

        let main = container.createDiv({ cls: "main_frame" });

        main.appendChild(this.daily_events.Display())
        main.appendChild(this.weekly_events.Display())

    }

    async onOpen() {

        console.log("Open View")

        // @ts-ignore
        this.api = this.app.plugins.plugins["google-calendar"].api

        this.calendars = new Array<any>();

        await this.init_load_data();
        
        this.set_up()

        this.registerInterval(
            window.setInterval(() => 
            {
                this.refresh();
            }, 5000)
        );
 
    }
    
    async onClose() {

        console.log("Close View");
        
    }

    async refresh()
    {

        // Clear unique_events for getting weekly events
        this.unique_events.length = 0
        await this.load_data()
        
        this.daily_events.Display()
        this.weekly_events.Display()

    }

    onPaneMenu(menu: Menu, source: string): void {
        super.onPaneMenu(menu, source)
        menu.addItem((item) => {
            item.setTitle("Refresh");
            item.setIcon("sync");
            item.onClick(() => {
                this.refresh()
            });
        });
    }

}


// export class Calendar_View extends ItemView {

//     // @ts-ignore
//     api: any = this.app.plugins.plugins["google-calendar"].api;
    
//     daily_events: Event_List;
//     weekly_events: Event_List;

//     constructor(leaf: WorkspaceLeaf) {
//         super(leaf);
//     }
    
//     getViewType() {
//         return VIEW_CALENDAR_VIEW;
//     }
    
//     getDisplayText() {
//         return "Calendar View";
//     }

//     // async set_up() {

//     // 	// @ts-ignore
//     // 	const api = this.app.plugins.plugins["google-calendar"].api;

//     // 	let current = new Date(); // get current date

//     // 	// Monday based days
//     // 	function week_day(date: Date) : number
//     // 	{
//     // 		let std_day = date.getDay()
//     // 		return (std_day == 0)? 6 : std_day - 1
//     // 	}

//     // 	const day_time = 86400000;

//     // 	let first = current.getTime() - ((week_day(current)) * day_time);
//     // 	let last = first + (6 * day_time);

//     // 	let first_day = new Date(first);
//     // 	first_day.setHours(0, 0, 0, 0);
//     // 	let last_day = new Date(last);
//     // 	last_day.setHours(0, 0, 0, day_time - 1);

//     // 	let first_today = new Date(current);
//     // 	first_today.setHours(0, 0, 0, 0);
//     // 	let last_today = new Date(current);
//     // 	last_today.setHours(0, 0, 0, day_time - 1);

//     // 	const container = this.containerEl.children[1];

//     // 	container.empty();

//     // 	let main = container.createDiv({ cls: "main_frame" });

//     // 	// this.daily_events = new Event_List(api, first_today, last_today);
//     // 	// this.weekly_events = new Event_List(api, first_day, last_day);

//     // 	////////////////////////////////////////////////////////////////////////////////////////////////

//     // 	{
//     // 		let daily_events = main.createDiv({ cls: "event_container" });
        
//     // 		daily_events.createEl("h1", { cls: "title", text: "Daily" });
    
//     // 		let daily_events_block = daily_events.createDiv({ cls: "event_block" });
    
//     // 		let events = new Event_List(api, first_today, last_today, (event: any) =>
//     // 		{
//     // 			// console.log(event.eventType); 
//     // 			if (event.eventType == "multiDay")
//     // 				return null;
//     // 			return event; 
//     // 		});
    
//     // 		await events.Load();
    
//     // 		daily_events_block.appendChild(events.Display());
//     // 	}
        
//     // 	{
//     // 		let weekly_events = main.createDiv({ cls: "event_container" });
        
//     // 		weekly_events.createEl("h1", { cls: "title", text: "Weekly" });
    
//     // 		let weekly_events_block = weekly_events.createDiv({ cls: "event_block" });
    
//     // 		let unique_events = new Array<String>;
//     // 		let events = new Event_List(api, first_day, last_day, (event: any) =>
//     // 		{
//     // 			if (event.eventType != "multiDay")
//     // 				return null;
//     // 			if (unique_events.includes(event.etag))
//     // 				return null;
//     // 			unique_events.push(event.etag);
//     // 			const regex = / \(.*?\)(?!.* \(.*?\))/;
//     // 			event.summary = event.summary.replace(regex, "");
//     // 			return event;
//     // 		});
    
//     // 		await events.Load();
    
//     // 		weekly_events_block.appendChild(events.Display());
//     // 	}

//     // 	// let event_container = main.createDiv({ cls: "event_container" });
        
//     // 	// event_container.createDiv({ cls: "title" }).createEl("h1", { text: "Tasks" });

//     // 	// let events = new Event_Container(api, first_day, last_day);

//     // 	// await events.Load();

//     // 	// event_container.appendChild(events.Display());

//     // }
    
//     async add_event()
//     {

//         new Create_Event_Modal(this.app, this.api).open();

//     }

//     set_up()
//     {

//         console.log("Set up")

//         const container = this.containerEl.children[1];
//         container.empty();

//         let main = container.createDiv({ cls: "main_frame" });

//         let daily_events = new Event_Container()

//         main.appendChild(daily_events.Display())

//         let button = main.createEl("button", { text: "Button" })

//         button.onclick = async () =>
//         {

//             this.add_event()

//             // let current = new Date(); // get current date

//             // // Monday based days
//             // function week_day(date: Date) : number
//             // {
//             // 	let std_day = date.getDay()
//             // 	return (std_day == 0)? 6 : std_day - 1
//             // }

//             // const day_time = 86400000;

//             // let first = current.getTime() - ((week_day(current)) * day_time);
//             // let last = first + (6 * day_time);

//             // let first_day = new Date(first);
//             // first_day.setHours(0, 0, 0, 0);
//             // let last_day = new Date(last);
//             // last_day.setHours(0, 0, 0, day_time - 1);

//             // let first_today = new Date(current);
//             // first_today.setHours(0, 0, 0, 0);
//             // let last_today = new Date(current);
//             // last_today.setHours(0, 0, 0, day_time - 1);
            
//             // console.log(first_day)
//             // console.log(last_day)

//             // // @ts-ignore
//             // const api = this.app.plugins.plugins["google-calendar"].api;
    
//             // const { createEvent } = api

//             // let test = await createEvent({
//             // 	summary: "Test event",
//             // 	start: {
//             // 	 dateTime: window.moment(first_day)
//             // 	},
//             // 	end: {
//             // 	 dateTime: window.moment(last_day)
//             // 	}
//             // })

//             // console.log(test)

//         }

//         // let daily_events = main.createDiv({ cls: "event_container" });
        
//         // daily_events.createEl("h1", { cls: "title", text: "Daily" });
    
//         // let daily_events_block = daily_events.createDiv({ cls: "event_block" });

//     }

//     async load_data()
//     {

//         // @ts-ignore
//         const api = this.app.plugins.plugins["google-calendar"].api;
    
//         const { getEvents } = api

//         let events = await getEvents({})

//         console.log(events)

//     }

//     async onOpen() {

//         console.log("Open View")

//         // const container = this.containerEl.children[1];
//         // container.empty();
//         // container.createEl("h4", { text: "Calendar View" });

//         // // @ts-ignore
//         // const { getEvents } = this.app.plugins.plugins["google-calendar"].api;
//         // const theEvents = await getEvents({ startDate: window.moment("08/26/2024"), endDate: window.moment("09/01/2024") });
        
//         // // @ts-ignore
//         // container.createEl("p", { text: theEvents.reduce((text, event)=> text += "\n" + event.summary, "") });
    
//         await this.load_data();

//         this.set_up();

//         // this.registerInterval(window.setInterval(() => this.refresh(), 10000));

//     }
    
//     async onClose() {

//         console.log("Close View");

//         // Nothing to clean up.
//     }

//     onPaneMenu(menu: Menu, source: string): void {
//         super.onPaneMenu(menu, source)
//         menu.addItem((item) => {
//             item.setTitle("Refresh");
//             item.setIcon("sync");
//             item.onClick(() => {
//                 this.onClose()
//                 this.onOpen()
//             });
//         });
//     }

// }
