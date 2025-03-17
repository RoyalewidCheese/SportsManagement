import { useEffect, useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data } = await axios.get("http://localhost:8000/api/feedback");
    setFeedbacks(data);
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/feedback", { message });
    fetchFeedbacks();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Feedback</h1>
      <form onSubmit={handleAddFeedback} className="mb-4">
        <textarea className="border p-2 w-full" placeholder="Your feedback..." onChange={(e) => setMessage(e.target.value)} required></textarea>
        <button className="bg-green-500 text-white px-4 py-2">Submit Feedback</button>
      </form>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id} className="border p-2 mb-2">{feedback.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feedback;