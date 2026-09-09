import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import { useCalendarEvents } from "@/api/hooks";
import type { CalendarEvent } from "@/api/calendar";
import { Card } from "@/components/ui/Card";

const TYPE_COLORS: Record<string, string> = {
  class: "#3b82f6",
  partner_meeting: "#10b981",
  event: "#f59e0b",
  deadline: "#ef4444",
};

export default function CalendarPage() {
  const {
    data: events = [],
    isLoading: loading,
    error: calendarError,
  } = useCalendarEvents();
  const err = calendarError
    ? calendarError instanceof Error
      ? calendarError.message
      : "Failed to load calendar."
    : null;

  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: String(e.id),
        title: e.title_jp ? `${e.title} / ${e.title_jp}` : e.title,
        start: e.start_at,
        end: e.end_at,
        backgroundColor: TYPE_COLORS[e.type] || "#6b7280",
        borderColor: TYPE_COLORS[e.type] || "#6b7280",
        extendedProps: { ...e },
      })),
    [events],
  );

  return (
    <div
      style={{
        maxWidth: "var(--content-max-width)",
        margin: "0 auto",
        padding: "var(--space-6) var(--container-px)",
      }}
    >
      <header style={{ marginBottom: "var(--space-5)" }}>
        <h1>Activity calendar</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Partner meetings, classes and event schedule
        </p>
      </header>
      <Card padding="md">
        {loading && <p>Loading calendar...</p>}
        {err && <p style={{ color: "var(--color-error)" }}>{err}</p>}
        {!loading && !err && (
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,listWeek",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              list: "List",
            }}
            noEventsContent="No activities scheduled this period."
            locale="en"
            firstDay={1}
            height="auto"
            events={fcEvents}
            eventClick={(info) => {
              const e = info.event.extendedProps as CalendarEvent;
              alert(
                `${e.title}\n${e.description ?? ""}\n${new Date(e.start_at).toLocaleString("en-GB")}`,
              );
            }}
          />
        )}
      </Card>
    </div>
  );
}
