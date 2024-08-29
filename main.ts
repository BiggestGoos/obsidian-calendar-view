import * as _ from "date_week"
import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";

export default class HelloWorldPlugin extends Plugin {

	async onload() {
		
        console.log("load")

        this.registerView(
			VIEW_CALENDAR_VIEW,
			(leaf) => new Calendar_View(leaf)
		);

        this.addRibbonIcon("calendar-check-2", "Calendar View", () => {
			// this.activateView();
            console.log("Calendar View");
            this.Activate_Calendar_View();
		});

	}

	onunload() {

		console.log("unloded")
		
	}

    // async Activate_Calendar_View() {
	// 	const { workspace } = this.app;
	
	// 	// let leaf = workspace.getLeaf(false);
		
    //     let leaf = workspace.getActiveViewOfType(MarkdownView)?.leaf

    //     let file = workspace.getActiveFile()

    //     console.log(file?.name)

    //     // console.log(leaf.view.getViewType())
        
    //     // const VIEW_MARKDOWN = "markdown"
        
    //     // this.app.fileManager.processFrontMatter()

    //     if (leaf)
    //     {
	// 		await leaf.setViewState({ type: VIEW_CALENDAR_VIEW, active: true });
    //         workspace.revealLeaf(leaf);
    //     }

	// }

	async Activate_Calendar_View()
	{
		const { workspace } = this.app;		
		
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_CALENDAR_VIEW);

		if (leaves.length > 0) {
		// A leaf with our view already exists, use that
		leaf = leaves[0];
		} else {
		// Our view could not be found in the workspace, create a new leaf
		// in the right sidebar for it
		leaf = workspace.getLeaf(true);
		if (leaf)
			await leaf.setViewState({ type: VIEW_CALENDAR_VIEW, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf)
			workspace.revealLeaf(leaf);

	}

}

export const VIEW_CALENDAR_VIEW = "calendar-view";

export class Calendar_View extends ItemView {

	constructor(leaf: WorkspaceLeaf) {
	    super(leaf);
	}
	
	getViewType() {
	    return VIEW_CALENDAR_VIEW;
	}
  
	getDisplayText() {
	    return "Calendar View";
	}

	async refresh() {

		// @ts-ignore
		const { getEvents } = this.app.plugins.plugins["google-calendar"].api;

		let current = new Date(); // get current date

		// Monday based days
		function week_day(date: Date) : number
		{
			let std_day = date.getDay()
			return (std_day == 0)? 6 : std_day - 1
		}

		const day_time = 86400000;

		let first = current.getTime() - ((week_day(current)) * day_time);
		let last = first + (6 * day_time);

		let first_day = new Date(current.setTime(first));
		let last_day = new Date(current.setTime(last));

		const events = await getEvents({ startDate: window.moment(first_day), endDate: window.moment(last_day) });
		
		const container = this.containerEl.children[1];

		container.empty();

		container.createEl("h4", { text: "Calendar View" });

		// console.log(first_day.toISOString() + " : " + first_day.getWeek().toString())
		// console.log(last_day.toISOString() + " : " + last_day.getWeek().toString())
		
		console.log(first_day.getMonth().toString() + "/" + first_day.getDate().toString() + "/" + first_day.getFullYear().toString())

		// @ts-ignore
		events.forEach(element => {
			console.log(element);
			let text = element.summary + "<br>" + element.start.date + " : " + element.end.date;
			let el = container.createEl("p", { cls: "test_text" });
			el.innerHTML = text
		});

		// theEvents.reduce((event)=> console.log("\n" + event.summary + " : " + event.start.date + " : " + event.end.date, ""))

		// container.createEl("p", { text: theEvents.reduce((text, event)=> text += "\n" + event.summary + " : " + event.start.date + " : " + event.end.date, "") });
		
	}
  
	async onOpen() {

        console.log("Open View")

        // const container = this.containerEl.children[1];
        // container.empty();
        // container.createEl("h4", { text: "Calendar View" });

		// // @ts-ignore
		// const { getEvents } = this.app.plugins.plugins["google-calendar"].api;
		// const theEvents = await getEvents({ startDate: window.moment("08/26/2024"), endDate: window.moment("09/01/2024") });
		
		// // @ts-ignore
		// container.createEl("p", { text: theEvents.reduce((text, event)=> text += "\n" + event.summary, "") });
 
		this.refresh();

		// this.registerInterval(window.setInterval(() => this.refresh(), 10000));

	}
  
	async onClose() {

        console.log("Close View")

	    // Nothing to clean up.
	}
}