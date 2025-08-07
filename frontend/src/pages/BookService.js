import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./BookService.css";

function BookService() {
  const { token } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [weatherWarning, setWeatherWarning] = useState(null);
  const [checkingWeather, setCheckingWeather] = useState(false);
  const [fineWeather, setFineWeather] = useState(false);


  useEffect(() => {
    axios
      .get("http://localhost:5050/api/services/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setServices(res.data.services)
      })
      .catch((err) => console.error("Failed to fetch services", err));
  }, []);

  useEffect(() => {
    const found = services.find((s) => s._id === selectedServiceId);
    setSelectedService(found || null);
  }, [selectedServiceId, services]);

  useEffect(() => {
    const checkWeather = async () => {
      if (!place || !scheduledDate) return;

      setCheckingWeather(true);
      setWeatherWarning(null); // reset

      try {
        const res = await axios.post("http://localhost:5050/api/check-weather", { place, scheduledDate }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        if (!res.data.ok) {
          setWeatherWarning("⚠️ Bad weather is expected at your selected location. Consider choosing another date.");
          setFineWeather(false);
        }
        if (res.data.ok) {
          setFineWeather(true);
          setWeatherWarning("");
        }
      } catch (err) {
        console.error("Weather check failed:", err.message);
      } finally {
        setCheckingWeather(false);
      }
    };

    checkWeather();
  }, [place, scheduledDate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedServiceId || !scheduledDate) {
      alert("Please select a service and date.");
      return;
    }

    const selectedDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    if (selectedDate < today) {
      alert("Please select a valid future date for booking.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5050/api/bookings",
        {
          serviceId: selectedServiceId,
          scheduledDate,
          providerId: selectedService?.provider?.user?._id,
          notes,
          place
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 400) {
        alert(res?.data?.message);
        return;
      }

      if (res.status === 201) {
        alert("Service booked successfully!");
      }


    } catch (err) {
      console.error(err);
      alert("Failed to book service.");
    }
  };

  return (
    <div className="book-service-page">

      <h2>Book a Service</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        {/* Service Selection */}
        <div className="form-card">
          <label>Select a Service</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            required
          >
            <option value="">-- Select Service --</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - {service.description} – £{service.price} ({service.provider?.user?.name || "Provider"}) - {service?.ecoFriendly ? "Ecofriendly" : "Not Ecofriendly"}
              </option>
            ))}
          </select>
        </div>

        {/* Place of booking */}

        <div className="form-card">
          <label>Place of booking</label>
          <input
            placeholder="London, UK"
            required
            name="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />

        </div>

        {/* Date */}
        <div className="form-card">
          <label>Select Date</label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Address & Notes */}
        <div className="form-card">
          <label>Address / Notes for Provider</label>
          <textarea
            rows={4}
            required
            placeholder="Enter your full address and any special instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Summary */}
        {selectedService && (
          <div className="form-card summary">
            <h4>Review Summary</h4>
            <p>Service: {selectedService.name}</p>
            <p>Provider: {selectedService.provider?.user?.name}</p>
            <p>Price: £{selectedService.price}</p>
            <p>Date: {scheduledDate}</p>
          </div>
        )}

        {checkingWeather && (
          <div className="form-card weather-info">
            <p>Checking weather forecast...</p>
          </div>
        )}

        {weatherWarning && (
          <div className="form-card weather-warning" style={{ color: "#e53935", fontWeight: "bold" }}>
            {weatherWarning}
          </div>
        )}

        {fineWeather && (
          <div className="form-card weather-warning" style={{ color: "#4CAF50", fontWeight: "bold" }}>Weather is okay.</div>
        )
        }



        <div className="sticky-continue">
          <button
            type="submit"
            disabled={!fineWeather}
            style={{
              backgroundColor: fineWeather ? '#4CAF50' : '#ccc', 
              color: fineWeather ? '#fff' : '#666',             
              cursor: fineWeather ? 'pointer' : 'not-allowed',
           
            }}
          >
            Continue
          </button>
        </div>





      </form>
    </div>
  );
}

export default BookService;
