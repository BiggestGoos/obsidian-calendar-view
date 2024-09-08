import test from "node:test";
import { Plugin, ItemView, WorkspaceLeaf, setIcon, Menu, App, Modal, Notice } from "obsidian";
// @ts-ignore
import "src/extra/date_week";

import { Calendar_View, VIEW_CALENDAR_VIEW } from "src/View"

export default class Calendar_View_Plugin extends Plugin {

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