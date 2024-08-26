import { Plugin, ItemView, WorkspaceLeaf, TFile, MarkdownView, FileManager } from 'obsidian';

export default class HelloWorldPlugin extends Plugin {

	async onload() {
		
        console.log('load')

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

		console.log('unloded')
 
	}

    async Activate_Calendar_View() {
		const { workspace } = this.app;
	
		// let leaf = workspace.getLeaf(false);
		
        let leaf = workspace.getActiveViewOfType(MarkdownView)?.leaf

        let file = workspace.getActiveFile()

        console.log(file?.name)

        // console.log(leaf.view.getViewType())
        
        // const VIEW_MARKDOWN = "markdown"
        
        // this.app.fileManager.processFrontMatter()

        if (leaf)
        {
			await leaf.setViewState({ type: VIEW_CALENDAR_VIEW, active: true });
            workspace.revealLeaf(leaf);
        }

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
  
	async onOpen() {

        console.log("Open View")

        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: "Calendar View" });
	}
  
	async onClose() {

        console.log("Close View")

	    // Nothing to clean up.
	}
}