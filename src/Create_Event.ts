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

			const { createEvent, updateEvent } = this.api

			let argument = {
				summary: text_field.value,
				location: "Somewhere",
				start: {
				 dateTime: window.moment(new Date(start_date_field.value)),
				 timeZone: "Europe/Stockholm"
				},
				end: {
				 dateTime: window.moment(new Date(end_date_field.value)),
				 timeZone: "Europe/Stockholm"
				},
				recurrence: ["RRULE:FREQ=DAILY;COUNT=10"]
			}

			console.log(argument);

			let test = await createEvent(argument);
			
			// test.recurrence = ["RRULE:FREQ=DAILY;COUNT=10"]

			// test = await updateEvent(test, false);

			// console.log(test);

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