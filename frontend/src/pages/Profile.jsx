import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const fileRef = useRef(null);
  const [user, setUser] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    profile_pic: "",
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser((prev) => ({ ...prev, ...stored }));
    } catch {}
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
  };

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setUser((p) => {
        const next = { ...p, profile_pic: dataUrl };
        localStorage.setItem("user", JSON.stringify(next));
        window.dispatchEvent(new Event("userUpdated"));
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => fileRef.current?.click();

  const removePhoto = () => {
    setUser((p) => {
      const next = { ...p, profile_pic: "" };
      localStorage.setItem("user", JSON.stringify(next));
      window.dispatchEvent(new Event("userUpdated"));
      return next;
    });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userUpdated"));
    alert("Profile updated!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:w-256">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Profile</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300 mb-3">
          {user.profile_pic ? (
            <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
              No photo
            </div>
          )}
        </div>
          <span className="mb-4 text-xl font-bold"> {user.username}</span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={openFilePicker}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Update Photo
          </button>

          {user.profile_pic && (
            <button
              type="button"
              onClick={removePhoto}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition"
            >
              Remove Photo
            </button>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFilePicked} className="hidden" />
      </div>

      {/* Two-column editable fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-medium">Full Name</span>
          <input
            name="full_name"
            value={user.full_name}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Phone Number</span>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

      
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-6 bg-green-600 text-white rounded py-2 hover:bg-green-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
