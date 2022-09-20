export interface CalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  start: {
      date: string;
  }
  end: {
      date: string;
  }
  creator:
    | {
        email: string;
        displayName: string;
        self: boolean;
      }
    | undefined;
  organizer:
    | {
        email: string;
        displayName: string;
        self: boolean;
      }
    | undefined;
}

export interface CalendarEvents {
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: Array<null>;
  nextSyncToken: string;
  items: Array<CalendarEvent>;
}
