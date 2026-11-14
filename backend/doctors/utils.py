from datetime import datetime, timedelta


def generate_slots(availability):

    slots = []

    current_time = datetime.combine(
        availability.date,
        availability.start_time
    )

    end_time = datetime.combine(
        availability.date,
        availability.end_time
    )

    duration = timedelta(
        minutes=availability.slot_duration
    )

    while current_time + duration <= end_time:

        slot_end = current_time + duration

        slots.append({
            'start_time': current_time.time(),
            'end_time': slot_end.time()
        })

        current_time = slot_end

    return slots