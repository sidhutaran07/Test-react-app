
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function Leads() {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // Fetch leads (admin only)
  useEffect(() => {
    if (!currentUser) return;
    async function fetchLeads() {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch("/api/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchLeads();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Lead submitted ✅");
        setLeads((prev) => [...prev, data]);
        setName("");
        setEmail("");
      } else {
        setStatus(data.error || "Error");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting lead");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md">
      <h3 className="text-lg font-semibold mb-2">Leads</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="p-2 border rounded"
        />
        <button className="p-2 bg-blue-600 text-white rounded">Submit Lead</button>
      </form>

      {status && <p className="text-sm mb-2">{status}</p>}

      {leads.length > 0 && (
        <div>
          <h4 className="font-semibold mb-1">Leads List:</h4>
          <ul className="list-disc ml-5">
            {leads.map((lead) => (
              <li key={lead._id}>
                {lead.name} ({lead.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
            }
