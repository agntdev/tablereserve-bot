# Restaurant Reservation Bot — Bot specification

**Archetype:** booking

**Voice:** professional and concise — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot for restaurant table reservations that allows guests to book available time slots by date, party size, and time, with confirmation codes and reminders. Owners can view upcoming reservations, track remaining capacity, and mark no-shows, while configuring opening hours, table types, and slot durations.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- restaurant guests
- restaurant owners/staff

## Success criteria

- Guests can book available table slots without seeing occupied times
- Guests receive a confirmation with a reservation code and a reminder before their visit
- Guests can reschedule or cancel via inline buttons
- Owners can view upcoming reservations and today's remaining capacity at a glance
- Owners can configure opening hours, seating duration, and table types

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open the main menu and welcome message
- **/help** (command, actor: user, command: /help) — Show help and privacy information
- **Book a Table** (button, actor: user, callback: booking:start) — Initiate the table booking flow
- **Owner Dashboard** (button, actor: user, callback: owner:dashboard) — Access the owner dashboard for managing reservations and settings

## Flows

### Guest Booking Flow
_Trigger:_ /start or /booking:start

1. Welcome message and privacy explanation
2. Choose a date via calendar UI
3. Select available time slot based on party size and table availability
4. Confirm party size and collect optional guest info (name/phone)
5. Show confirmation with reservation code and inline buttons for reschedule/cancel
6. Send reminder X hours before reservation

_Data touched:_ Reservation, Table type, Opening hours

### Reschedule Flow
_Trigger:_ Reschedule button click

1. Show available dates/times for rescheduling
2. Select new time slot
3. Update reservation with new slot and send new confirmation code

_Data touched:_ Reservation, Table type

### Cancel Flow
_Trigger:_ Cancel button click

1. Confirm cancellation
2. Mark reservation as cancelled

_Data touched:_ Reservation

### Owner Dashboard Flow
_Trigger:_ /owner or owner:dashboard

1. Show list of upcoming reservations with quick actions
2. Display today's remaining capacity at a glance
3. Allow editing of opening hours, slot duration, table types, and reminder lead time

_Data touched:_ Reservation, Table type, Opening hours, Owner settings

### Mark No-Show Flow
_Trigger:_ Owner marks no-show

1. Update reservation status to no-show
2. Optionally send message to guest

_Data touched:_ Reservation

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Table type** _(retention: persistent)_ — Table configuration with capacity and quantity
  - fields: capacity, quantity
- **Opening hours** _(retention: persistent)_ — Daily working window and closed dates
  - fields: start_time, end_time, closed_dates
- **Slot duration** _(retention: persistent)_ — Fixed seating duration for generating time slots
  - fields: duration_minutes
- **Reservation** _(retention: persistent)_ — Guest reservation details and status
  - fields: guest_name, guest_phone, party_size, date, time_slot, status, reservation_code, created_at, reminder_sent
- **Owner settings** _(retention: persistent)_ — Owner-configurable settings for the bot
  - fields: opening_hours, slot_duration, table_types, reminder_lead_time
- **Owner admin** _(retention: persistent)_ — List of owner/staff Telegram IDs with access to the dashboard
  - fields: telegram_ids

## Integrations

- **Telegram** (required) — Bot API messaging for guest and owner interactions
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Configure opening hours
- Set slot duration
- Define table types (capacity and quantity)
- Set reminder lead time
- View upcoming reservations
- Mark no-shows
- Cancel reservations
- View today's remaining capacity

## Notifications

- Guest confirmation message with reservation code
- Reminder message X hours before reservation
- Owner digest of upcoming reservations
- Owner alerts for new bookings or changes

## Permissions & privacy

- Guest data (name/phone) only accessible to owner and guest
- Owner admin access restricted to configured Telegram IDs
- No external data sharing or public calendars

## Edge cases

- Guest tries to book outside of opening hours
- Guest tries to book a party size larger than available tables
- Owner tries to edit settings while reservations are in progress
- Guest cancels or reschedules after reminder has been sent
- Multiple guests try to book the same time slot simultaneously

## Required tests

- End-to-end guest booking flow with calendar selection and confirmation
- Rescheduling flow with updated time slots and new confirmation code
- Owner dashboard displays correct remaining capacity and upcoming reservations
- Reminder is sent at the correct time before reservation
- Owner can mark no-shows and update settings successfully

## Assumptions

- Opening hours default to 12:00-23:00 local time
- Slot duration defaults to 90 minutes
- Reminder lead time defaults to 2 hours
- Guest contact fields are optional
- Owner access is configured by Telegram ID
