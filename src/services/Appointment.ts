import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

class AppointmentService {
  public async fetchAppointments(accessToken: string) {
    const authClient = new OAuth2Client();
    authClient.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3" });
    calendar.context._options.auth = authClient;

    const response = await calendar.events.list({
      calendarId: "primary",
      orderBy: "startTime",
      singleEvents: true,
      q: "Orthoplus",
    });

    const events = response.data.items;

    if (!events || events.length === 0) {
      console.log("No upcoming events found");
      return []
    }
    return events;
  }
}

export default new AppointmentService();
