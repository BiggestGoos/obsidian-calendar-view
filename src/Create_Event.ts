import { Modal, App } from "obsidian";

export class Create_Event_Modal extends Modal {

	api: any;

	constructor(app: App, api: any) {
	  	super(app);
		this.api = api
	}
  
	onOpen() {
	  	
		let { contentEl } = this;
	  	contentEl.setText("Create Event:");

		contentEl.createEl("br")

		let text_field = contentEl.createEl("input", { type: "text" })

		contentEl.createEl("br")

		let start_date_field = contentEl.createEl("input", { type: "datetime-local" })
		let end_date_field = contentEl.createEl("input", { type: "datetime-local" })

		contentEl.createEl("br")
		contentEl.createEl("br")

		let button = contentEl.createEl("button", { text: "Create" })

		button.onclick = async () =>
		{

			const { createEvent } = this.api

			let test = await createEvent({
				summary: text_field.value,
				start: {
				 dateTime: window.moment(new Date(start_date_field.value))
				},
				end: {
				 dateTime: window.moment(new Date(end_date_field.value))
				}
			})

			console.log(test)

			// console.log(text_field.value)
			// console.log(new Date(start_date_field.value))
			// console.log(new Date(end_date_field.value))

		}

	}
  
	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}

}