// pages/ArtistEdit.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artists } from "@/constants/artists";
import Navbar from "@/components/landing/Navbar";



const ArtistEdit = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "profile" | "music" | "gallery" | "booking" | "settings"
  >("profile");

  // Find artist data from constants
  const artist = artists.find((a) => a.slug === username);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    price: 0,
    tags: [] as string[],
    categories: [] as string[],
    isBookable: true,
    availability: [] as string[],
    timeSlots: [] as string[],
  });

  // Initialize form data when artist is found
  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        bio: artist.bio || "",
        price: artist.price,
        tags: artist.tags,
        categories: artist.categories,
        isBookable: artist.isBookable,
        availability: artist.availability,
        timeSlots: artist.timeSlots,
      });
    }
  }, [artist]);

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagChange = (tag: string, action: "add" | "remove") => {
    if (action === "add" && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    } else if (action === "remove") {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    }
  };

  const handleCategoryChange = (category: string, action: "add" | "remove") => {
    if (action === "add" && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    } else if (action === "remove") {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== c)
      }));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log("Saving artist data:", formData);
    alert("Changes saved successfully!");
  };

  const handleCancel = () => {
    navigate(`/artist/${username}`);
  };

  if (!artist) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Artist Not Found</h1>
          <p className="text-white/60">Unable to load artist data for "{username}".</p>
          <p className="text-white/60 mt-2">Try: /artist/divine/edit</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <div className="w-full p-4 md:p-6 lg:p-8 pb-24 md:pb-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 border-b border-dashed border-white pb-8">
          <div>
            <h1 className="font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              EDIT PROFILE
            </h1>
            <p className="text-white/70 text-lg">Update your artist information</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleCancel}
              className="bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-6 md:mb-8 border-b border-dashed border-white pb-4">
          {["profile", "music", "gallery", "booking", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "profile" | "music" | "gallery" | "booking" | "settings")}
              className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                activeTab === tab
                  ? "bg-white text-black border-white"
                  : "text-white border-white/30 hover:border-white/60"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="min-h-[400px]">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Basic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Artist Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                        placeholder="Enter artist name"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">Starting Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                        className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                        placeholder="Enter starting price"
                      />
                      <p className="text-white/50 text-xs mt-1">Current: {formatPrice(artist.price)}</p>
                    </div>
                  </div>
                </div>

                {/* Categories & Tags */}
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Categories & Tags</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Categories</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.categories.map((category, index) => (
                          <span
                            key={index}
                            className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1 text-sm rounded flex items-center gap-2"
                          >
                            {category}
                            <button
                              onClick={() => handleCategoryChange(category, "remove")}
                              className="text-orange-400 hover:text-orange-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add new category"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            handleCategoryChange(e.currentTarget.value.trim(), "add");
                            e.currentTarget.value = "";
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-white/10 border border-white/20 text-white px-3 py-1 text-sm rounded flex items-center gap-2"
                          >
                            {tag}
                            <button
                              onClick={() => handleTagChange(tag, "remove")}
                              className="text-white/60 hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add new tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            handleTagChange(e.currentTarget.value.trim(), "add");
                            e.currentTarget.value = "";
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Availability Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Available Time Slots</label>
                    <div className="space-y-2">
                      {["18:00", "19:00", "20:00", "21:00", "22:00"].map((time) => (
                        <label key={time} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.timeSlots.includes(time)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange("timeSlots", [...formData.timeSlots, time]);
                              } else {
                                handleInputChange("timeSlots", formData.timeSlots.filter(t => t !== time));
                              }
                            }}
                            className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                          />
                          <span className="text-white">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Booking Status</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.isBookable}
                          onChange={(e) => handleInputChange("isBookable", e.target.checked)}
                          className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                        />
                        <span className="text-white">Accept new bookings</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Music Tab */}
          {activeTab === "music" && (
            <div className="space-y-8">
              {/* Music Embeds */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Music Embeds</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">YouTube Video URL</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-white/50 text-xs mt-1">Add your best performance video</p>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Spotify Track URL</label>
                    <input
                      type="url"
                      placeholder="https://open.spotify.com/track/..."
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-white/50 text-xs mt-1">Link to your Spotify tracks</p>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">SoundCloud URL</label>
                    <input
                      type="url"
                      placeholder="https://soundcloud.com/..."
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-white/50 text-xs mt-1">Link to your SoundCloud profile</p>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Apple Music URL</label>
                    <input
                      type="url"
                      placeholder="https://music.apple.com/..."
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-white/50 text-xs mt-1">Link to your Apple Music profile</p>
                  </div>
                </div>
              </div>

              {/* Music Categories */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Music Style & Genre</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Primary Music Style</label>
                    <select className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500">
                      <option>Hip-Hop</option>
                      <option>Rap</option>
                      <option>Classical</option>
                      <option>Bollywood</option>
                      <option>Folk</option>
                      <option>Jazz</option>
                      <option>Rock</option>
                      <option>Pop</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Languages You Perform In</label>
                    <div className="flex flex-wrap gap-2">
                      {["Hindi", "English", "Punjabi", "Tamil", "Telugu", "Marathi", "Gujarati"].map((lang) => (
                        <label key={lang} className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500" />
                          <span className="text-white text-sm">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              {/* Current Photos */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Current Photos</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artist.photos?.slice(0, 8).map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full aspect-square object-cover rounded border border-white/20"
                        onError={(e) => {
                          e.currentTarget.src = "/images/artistNotFound.jpeg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-red-500/80 text-white px-3 py-1 rounded text-sm hover:bg-red-500">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors">
                    + Add More Photos
                  </button>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Upload New Photos</h3>
                
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <div className="text-white/60 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-semibold">Drag & Drop Photos Here</p>
                    <p className="text-sm">or click to browse</p>
                  </div>
                  <button className="bg-orange-500 text-black px-6 py-3 rounded font-semibold hover:bg-orange-600 transition-colors">
                    Choose Files
                  </button>
                  <p className="text-white/50 text-xs mt-2">JPG, PNG up to 10MB each</p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Tab */}
          {activeTab === "booking" && (
            <div className="space-y-8">
              {/* Pricing Structure */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Pricing Structure</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Base Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                      placeholder="Enter base price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Price per Additional Hour (₹)</label>
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Travel Fee (₹)</label>
                    <input
                      type="number"
                      placeholder="2000"
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Equipment Fee (₹)</label>
                    <input
                      type="number"
                      placeholder="1000"
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Availability Calendar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Available Days</label>
                    <div className="space-y-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <label key={day} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked={["Friday", "Saturday", "Sunday"].includes(day)}
                            className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                          />
                          <span className="text-white">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Blocked Dates</label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 bg-white/10 border border-white/20 text-white p-2 rounded focus:outline-none focus:border-orange-500"
                        />
                        <button className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-2 rounded hover:bg-red-500/30 transition-colors">
                          Block
                        </button>
                      </div>
                      <div className="text-white/60 text-sm">
                        <p>Currently blocked: 15 Jan, 28 Jan, 5 Feb</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Preferences */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Booking Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Advance Booking Required</label>
                    <select className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500">
                      <option>24 hours</option>
                      <option>48 hours</option>
                      <option>1 week</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Cancellation Policy</label>
                    <select className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500">
                      <option>Flexible (Full refund up to 24h before)</option>
                      <option>Moderate (Full refund up to 7 days before)</option>
                      <option>Strict (50% refund up to 7 days before)</option>
                      <option>No refunds</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                    />
                    <span className="text-white">Require deposit for booking confirmation</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                    />
                    <span className="text-white">Send confirmation emails to clients</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              {/* Account Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Account Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={`${artist.slug}@example.com`}
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                      readOnly
                    />
                    <p className="text-white/50 text-xs mt-1">Contact support to change email</p>
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Mumbai, Maharashtra"
                      className="w-full bg-white/10 border border-white/20 text-white p-3 rounded focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Privacy & Visibility</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Profile Visibility</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Show Contact Information</span>
                    <button className="w-12 h-6 bg-white/10 relative border border-white/30">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Show Real-time Availability</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Allow Direct Messages</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Notifications</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">SMS Notifications</span>
                    <button className="w-12 h-6 bg-white/10 relative border border-white/30">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Push Notifications</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white">Booking Reminders</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/10 border border-red-500/30 p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-6 font-mondwest">Danger Zone</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Deactivate Account</p>
                      <p className="text-white/60 text-sm">Temporarily hide your profile from searches</p>
                    </div>
                    <button className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 transition-colors">
                      Deactivate
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Delete Account</p>
                      <p className="text-white/60 text-sm">Permanently remove your account and all data</p>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistEdit;
