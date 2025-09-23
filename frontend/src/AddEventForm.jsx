import axios from "axios"
import { useState } from "react"

export default function AddEventForm({ onEventAdded}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("#3b82f6")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [repeat, setRepeat] = useState("none")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://127.0.0.1:8000/events", {
                title,
                description,
                color,
                start,
                end,
                repeat: { type: repeat },
            })
            onEventAdded(res.data)
            setTitle("")
            setDescription("")
            setStart("")
            setEnd("")
            setRepeat("none")
        } catch (err) {
            console.error("Failed to add event:", err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
            <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                classname="w-full border rounded p-2"
            />
            <input 
                type = "color"
                value = {color}
                onChange={(e) => setColor(e.target.value)}
                className = "w-16 h-10 cursor-pointer"
            />
            <div className="flex gap-2">
                <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    classname="border rounded p-2 flex-1"
                    required
                />
                <input 
                    type = "datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="border rounded p-2 flex-1"
                    required
                />
            </div>
            <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w.full border rounded p-2"
            >
              <option value="none">Does not repeat</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="montly">Monthly</option>  
              <option value="Custom">Custom</option>
            </select>
            <button type="submit" className = "w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Add Event
            </button>
        </form>
    )
}