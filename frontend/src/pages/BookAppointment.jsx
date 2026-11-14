import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Stethoscope,
    CalendarDays,
    Clock,
    CheckCircle,
} from "lucide-react";
import api from "../services/api";

function BookAppointment() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availabilities, setAvailabilities] = useState([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);

    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [reason, setReason] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get("doctors/");
                setDoctors(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.results || []
                );
            } catch (error) {
                setError("Unable to load doctors.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const fetchAvailability = async (doctor) => {
        setSelectedDoctor(doctor);
        setSelectedAvailability(null);
        setSelectedSlot(null);
        setAvailabilities([]);
        setSlots([]);
        setSuccess("");
        setBookingError("");
        setAvailabilityLoading(true);

        try {
            const response = await api.get("doctor-availability/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setAvailabilities(
                data.filter((item) => item.doctor === doctor.id)
            );
        } catch (error) {
            setBookingError("Unable to load doctor availability.");
        } finally {
            setAvailabilityLoading(false);
        }
    };


    const fetchSlots = async (availability) => {
        setSelectedAvailability(availability);
        setSelectedSlot(null);
        setSlots([]);
        setSuccess("");
        setBookingError("");
        setSlotsLoading(true);

        try {
            const response = await api.get(
                `doctor-availability/${availability.id}/slots/`
            );

            console.log("Slots API response:", response.data);

            const data = response.data;

            const slotList = Array.isArray(data)
                ? data
                : Array.isArray(data.slots)
                    ? data.slots
                    : Array.isArray(data.results)
                        ? data.results
                        : [];

            setSlots(slotList);

        } catch (error) {
            console.error("Slots API error:", error.response?.data || error);
            setBookingError("Unable to load available slots.");
        } finally {
            setSlotsLoading(false);
        }
    };


    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingError("");
        setSuccess("");

        if (!selectedDoctor || !selectedAvailability || !selectedSlot) {
            setBookingError("Please select a doctor, date and time slot.");
            return;
        }

        setBookingLoading(true);

        try {
            await api.post("appointments/", {
                doctor: selectedDoctor.id,
                date: selectedAvailability.date,
                start_time: selectedSlot.start_time,
                reason: reason,
            });

            setSuccess("Appointment request submitted successfully. Waiting for admin approval.");
            setSelectedSlot(null);
            setReason("");
            await fetchSlots(selectedAvailability);
        } catch (error) {
            const data = error.response?.data;
            setBookingError(
                data?.detail ||
                data?.non_field_errors?.[0] ||
                data?.start_time?.[0] ||
                "Unable to book appointment. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">

                <Link
                    to="/patient"
                    className="inline-flex items-center gap-2 text-blue-900 hover:underline mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                            <CalendarDays size={26} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Book an Appointment
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Select a doctor and choose an available appointment.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <p className="text-slate-500">Loading doctors...</p>
                    )}

                    {error && (
                        <p className="text-red-600">{error}</p>
                    )}

                    {!loading && !error && doctors.length === 0 && (
                        <p className="text-slate-500">No doctors available.</p>
                    )}

                    {/* Doctor List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {doctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                <div className="bg-blue-50 text-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope size={25} />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Dr. {doctor.user.username}
                                </h3>

                                <p className="text-blue-900 text-sm mt-2">
                                    {doctor.specialization}
                                </p>

                                <p className="text-slate-500 text-sm mt-1">
                                    {doctor.qualification}
                                </p>

                                <p className="text-slate-500 text-sm mt-1">
                                    {doctor.experience} years experience
                                </p>

                                <button
                                    onClick={() => fetchAvailability(doctor)}
                                    className="w-full mt-5 bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-lg font-medium transition"
                                >
                                    View Availability
                                </button>
                            </div>
                        ))}

                    </div>

                    {/* Doctor Availability */}
                    {selectedDoctor && (
                        <div className="mt-10 border-t border-slate-200 pt-8">

                            <h2 className="text-xl font-bold text-slate-800 mb-5">
                                Availability - Dr. {selectedDoctor.user.username}
                            </h2>

                            {availabilityLoading && (
                                <p className="text-slate-500">Loading availability...</p>
                            )}

                            {!availabilityLoading && availabilities.length === 0 && (
                                <p className="text-slate-500">
                                    No availability scheduled for this doctor.
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availabilities.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-slate-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                            <CalendarDays size={18} />
                                            {item.date}
                                        </div>

                                        <p className="text-sm text-slate-500 mt-3">
                                            {item.start_time} - {item.end_time}
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Slot duration: {item.slot_duration} minutes
                                        </p>

                                        <button
                                            onClick={() => fetchSlots(item)}
                                            className="mt-4 w-full bg-slate-100 hover:bg-blue-50 text-blue-900 py-2 rounded-lg text-sm font-semibold"
                                        >
                                            Select Date
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Time Slots */}
                    {selectedAvailability && (
                        <div className="mt-8 border-t border-slate-200 pt-8">

                            <h3 className="text-lg font-semibold text-slate-800 mb-4">
                                Available Time Slots
                            </h3>

                            {slotsLoading && (
                                <p className="text-slate-500">Loading slots...</p>
                            )}

                            {!slotsLoading && slots.length === 0 && (
                                <p className="text-slate-500">
                                    No available slots for this date.
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                {slots.map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium ${selectedSlot?.start_time === slot.start_time
                                                ? "bg-blue-900 text-white border-blue-900"
                                                : "bg-white text-slate-700 border-slate-300 hover:border-blue-900"
                                            }`}
                                    >
                                        <Clock size={15} className="inline mr-2" />
                                        {slot.start_time} - {slot.end_time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Booking Form */}
                    {selectedSlot && (
                        <form
                            onSubmit={handleBooking}
                            className="mt-8 border-t border-slate-200 pt-8 max-w-2xl"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-5">
                                Confirm Appointment Request
                            </h3>

                            <div className="bg-blue-50 rounded-lg p-4 mb-5 text-sm text-blue-900">
                                <p><strong>Doctor:</strong> Dr. {selectedDoctor.user.username}</p>
                                <p><strong>Date:</strong> {selectedAvailability.date}</p>
                                <p>
                                    <strong>Time:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}
                                </p>
                            </div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Reason for Appointment
                            </label>

                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="4"
                                required
                                placeholder="Describe your reason for visiting..."
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
                            />

                            {bookingError && (
                                <p className="text-red-600 text-sm mt-3">
                                    {bookingError}
                                </p>
                            )}

                            {success && (
                                <p className="text-green-700 text-sm mt-3 flex items-center gap-2">
                                    <CheckCircle size={18} />
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="mt-5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                {bookingLoading ? "Submitting..." : "Request Appointment"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}

export default BookAppointment;
