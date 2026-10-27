import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Users, Clock, Copy, Check, Trash2, Plus, Minus } from 'lucide-react';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/restaurantData';

export interface SelectedDishEntry {
  itemId: string;
  quantity: number;
  jainRequested: boolean;
}

export interface BanquetDraftConfig {
  packageName: string;
  pricePerPlate: number;
  guests: number;
  addonsList: string[];
  estimatedTotal: number;
}

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'table' | 'banquet';
  selectedDishes: SelectedDishEntry[];
  onUpdateDishQty: (itemId: string, delta: number) => void;
  onToggleDishJain: (itemId: string) => void;
  onClearDishes: () => void;
  banquetDraft: BanquetDraftConfig | null;
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({
  isOpen,
  onClose,
  initialMode,
  selectedDishes,
  onUpdateDishQty,
  onToggleDishJain,
  onClearDishes,
  banquetDraft,
}) => {
  const [mode, setMode] = useState<'table' | 'banquet'>(initialMode);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-10-28');
  const [session, setSession] = useState<'lunch' | 'dinner'>('dinner');
  const [timeSlot, setTimeSlot] = useState('08:00 PM');
  const [partySize, setPartySize] = useState(4);
  const [dietaryNote, setDietaryNote] = useState<'Regular Pure Veg' | 'Jain Counter Required' | 'Swaminarayan Friendly'>('Regular Pure Veg');
  const [occasion, setOccasion] = useState('Family Dinner & Buffet');
  const [specialNotes, setSpecialNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    referenceId: string;
    timestamp: string;
    summaryText: string;
  } | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const populatedDishes = selectedDishes
    .map((entry) => {
      const item = MENU_ITEMS.find((m) => m.id === entry.itemId);
      if (!item) return null;
      return { ...entry, item };
    })
    .filter(Boolean) as Array<SelectedDishEntry & { item: (typeof MENU_ITEMS)[0] }>;

  const dishesSubtotal = populatedDishes.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  const lunchTimes = ['11:30 AM', '12:15 PM', '01:00 PM', '01:45 PM', '02:15 PM'];
  const dinnerTimes = ['07:00 PM', '07:45 PM', '08:30 PM', '09:15 PM', '10:00 PM'];

  const handleSessionChange = (newSession: 'lunch' | 'dinner') => {
    setSession(newSession);
    setTimeSlot(newSession === 'lunch' ? '12:15 PM' : '08:30 PM');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = guestName.trim();
    const cleanPhone = phone.replace(/\s+/g, '');

    if (cleanName.length < 2) {
      setErrorMessage('Please enter your full name for the reservation desk.');
      return;
    }
    if (!/^[+]?[0-9]{10,13}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const refNum = `TM-${Math.floor(1000 + Math.random() * 9000)}`;
    const dishLines =
      populatedDishes.length > 0
        ? populatedDishes
            .map(
              (d) =>
                `${d.quantity}x ${d.item.name} (${d.jainRequested ? 'Jain' : 'Regular'}) - ₹${
                  d.item.price * d.quantity
                }`
            )
            .join('\n')
        : 'Walk-in Buffet / Table Selection';

    const summaryText =
      mode === 'banquet' && banquetDraft
        ? [
            `THAATH MAATH BANQUET INQUIRY (${refNum})`,
            `Guest: ${cleanName} (${cleanPhone})`,
            `Event Date: ${date} · ${session === 'lunch' ? 'Lunch' : 'Dinner'} (${timeSlot})`,
            `Package: ${banquetDraft.packageName} @ ₹${banquetDraft.pricePerPlate}/plate`,
            `Expected Guests: ${banquetDraft.guests} Guests`,
            `Dietary Line: ${dietaryNote}`,
            `Estimated Total: ₹${banquetDraft.estimatedTotal.toLocaleString('en-IN')}`,
            `Venue: 3rd Floor, Hilltown Plaza, SP Ring Road, Nikol, Ahmedabad`,
          ].join('\n')
        : [
            `THAATH MAATH TABLE RESERVATION (${refNum})`,
            `Guest: ${cleanName} (${cleanPhone})`,
            `Date & Time: ${date} at ${timeSlot} (${session === 'lunch' ? 'Lunch' : 'Dinner'})`,
            `Party Size: ${partySize} Guests · ${dietaryNote}`,
            `Pre-Selected Items:\n${dishLines}`,
            dishesSubtotal > 0 ? `Pre-Order Subtotal: ₹${dishesSubtotal.toLocaleString('en-IN')}` : '',
            `Venue: 3rd Floor, Hilltown Plaza, Nikol, Ahmedabad`,
          ]
            .filter(Boolean)
            .join('\n');

    setConfirmedBooking({
      referenceId: refNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      summaryText,
    });
  };

  const handleCopySummary = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.summaryText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-[2px] transition-opacity duration-150">
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] text-[#141413] h-full overflow-y-auto border-l border-[#E5E0D8] flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-drawer-title"
      >
        {/* Top Drawer Bar */}
        <div>
          <div className="sticky top-0 z-10 bg-[#FAF8F5]/95 backdrop-blur-sm px-6 py-5 border-b border-[#E5E0D8] flex items-center justify-between">
            <div>
              <h2 id="reservation-drawer-title" className="font-display text-2xl font-bold tracking-tight text-[#141413]">
                {mode === 'banquet' ? 'Banquet Event Reservation' : 'Table & Buffet Reservation'}
              </h2>
              <p className="text-xs text-[#5C5852] mt-0.5">
                {RESTAURANT_INFO.addressLine1} · Nikol, Ahmedabad
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#5C5852] hover:text-[#141413] rounded-lg hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              aria-label="Close reservation panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Segmented Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F2EFE9] rounded-lg border border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => {
                  setMode('table');
                  setConfirmedBooking(null);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'table'
                    ? 'bg-[#FAF8F5] text-[#141413] shadow-xs'
                    : 'text-[#5C5852] hover:text-[#141413]'
                }`}
              >
                Table & Unlimited Buffet
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('banquet');
                  setConfirmedBooking(null);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'banquet'
                    ? 'bg-[#FAF8F5] text-[#141413] shadow-xs'
                    : 'text-[#5C5852] hover:text-[#141413]'
                }`}
              >
                Grand Banquet Hall (50–350)
              </button>
            </div>

            {confirmedBooking ? (
              <div className="bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#1B5E20] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono-num text-[#1B5E20] font-medium">
                      Booking Reference #{confirmedBooking.referenceId} · Confirmed at {confirmedBooking.timestamp}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#141413] mt-1">
                      Your table & hospitality request is registered
                    </h3>
                    <p className="text-sm text-[#5C5852] mt-1">
                      Present reference <span className="font-mono-num font-semibold text-[#141413]">{confirmedBooking.referenceId}</span> at the 3rd Floor Reception Desk, Hilltown Plaza, Nikol.
                    </p>
                  </div>
                </div>

                <pre className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg p-4 text-xs font-mono-num text-[#141413] whitespace-pre-wrap leading-relaxed">
                  {confirmedBooking.summaryText}
                </pre>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#9E2A2B] text-white rounded-lg hover:bg-[#822021] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedReceipt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedReceipt ? 'Pass Copied to Clipboard' : 'Copy Booking Pass'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmedBooking(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#141413] border border-[#E5E0D8] bg-[#FAF8F5] rounded-lg hover:bg-[#E5E0D8]/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Modify Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Context Summary for Banquet or Pre-selected Menu Items */}
                {mode === 'banquet' && banquetDraft && (
                  <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#5C5852]">
                      <span>Selected Banquet Configuration</span>
                      <span className="font-mono-num font-semibold text-[#9E2A2B]">
                        ₹{banquetDraft.pricePerPlate}/plate
                      </span>
                    </div>
                    <div className="text-base font-semibold text-[#141413]">
                      {banquetDraft.packageName} · <span className="font-mono-num">{banquetDraft.guests}</span> Guests
                    </div>
                    {banquetDraft.addonsList.length > 0 && (
                      <div className="text-xs text-[#5C5852]">
                        Add-ons: {banquetDraft.addonsList.join(' · ')}
                      </div>
                    )}
                    <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-sm font-semibold">
                      <span>Estimated Event Total</span>
                      <span className="font-mono-num text-[#141413]">
                        ₹{banquetDraft.estimatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {mode === 'table' && populatedDishes.length > 0 && (
                  <div className="p-4 bg-[#F2EFE9] border border-[#E5E0D8] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#141413]">
                        Pre-Selected Buffet & À La Carte Items ({populatedDishes.reduce((a, b) => a + b.quantity, 0)})
                      </span>
                      <button
                        type="button"
                        onClick={onClearDishes}
                        className="inline-flex items-center gap-1 text-xs text-[#5C5852] hover:text-[#9E2A2B] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear list
                      </button>
                    </div>

                    <div className="divide-y divide-[#E5E0D8]">
                      {populatedDishes.map(({ item, quantity, jainRequested }) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#141413] truncate">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5C5852]">
                              <span className="font-mono-num">₹{item.price}</span>
                              {item.jainAvailable && (
                                <>
                                  <span>·</span>
                                  <button
                                    type="button"
                                    onClick={() => onToggleDishJain(item.id)}
                                    className="underline hover:text-[#141413] cursor-pointer"
                                  >
                                    {jainRequested ? 'Jain Prep Selected' : 'Switch to Jain Prep'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center border border-[#E5E0D8] bg-[#FAF8F5] rounded-md">
                              <button
                                type="button"
                                onClick={() => onUpdateDishQty(item.id, -1)}
                                className="p-1.5 text-[#5C5852] hover:text-[#141413] cursor-pointer"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-mono-num font-semibold">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => onUpdateDishQty(item.id, 1)}
                                className="p-1.5 text-[#5C5852] hover:text-[#141413] cursor-pointer"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-mono-num font-semibold w-14 text-right">
                              ₹{(item.price * quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-semibold">
                      <span>Estimated Table Pre-Order Subtotal</span>
                      <span className="font-mono-num text-sm text-[#9E2A2B]">
                        ₹{dishesSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-[#9E2A2B]/10 border border-[#9E2A2B]/30 rounded-lg text-xs font-medium text-[#9E2A2B]">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g., Rajeshbhai Patel"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98980 00000"
                      className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5C5852]" />
                        Preferred Date *
                      </span>
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#5C5852]" />
                        {mode === 'banquet' ? 'Expected Banquet Guests' : 'Table Party Size'}
                      </span>
                    </label>
                    {mode === 'table' ? (
                      <div className="flex items-center border border-[#E5E0D8] bg-white rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="px-3.5 py-2.5 text-sm font-semibold text-[#5C5852] hover:bg-[#F2EFE9] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-sm font-mono-num font-semibold">
                          {partySize} {partySize === 1 ? 'Guest' : 'Guests'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.min(40, partySize + 1))}
                          className="px-3.5 py-2.5 text-sm font-semibold text-[#5C5852] hover:bg-[#F2EFE9] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <input
                        type="number"
                        min={50}
                        max={350}
                        value={banquetDraft ? banquetDraft.guests : 120}
                        readOnly
                        className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#F2EFE9] border border-[#E5E0D8] rounded-lg text-[#141413]"
                      />
                    )}
                  </div>
                </div>

                {/* Dining Session & Time Slot */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#5C5852]" />
                      Dining Session & Arrival Slot
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => handleSessionChange('lunch')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        session === 'lunch'
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#5C5852] border-[#E5E0D8] hover:text-[#141413]'
                      }`}
                    >
                      Lunch (11:30 AM – 3:00 PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSessionChange('dinner')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        session === 'dinner'
                          ? 'bg-[#141413] text-white border-[#141413]'
                          : 'bg-white text-[#5C5852] border-[#E5E0D8] hover:text-[#141413]'
                      }`}
                    >
                      Dinner (7:00 PM – 11:00 PM)
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(session === 'lunch' ? lunchTimes : dinnerTimes).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`px-3 py-1.5 text-xs font-mono-num rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          timeSlot === slot
                            ? 'bg-[#9E2A2B] text-white border-[#9E2A2B]'
                            : 'bg-white text-[#5C5852] border-[#E5E0D8] hover:border-[#141413]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary & Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      Pure Veg Dietary Preference
                    </label>
                    <select
                      value={dietaryNote}
                      onChange={(e) => setDietaryNote(e.target.value as typeof dietaryNote)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                    >
                      <option value="Regular Pure Veg">100% Pure Veg (Standard)</option>
                      <option value="Jain Counter Required">Jain Preparation Required</option>
                      <option value="Swaminarayan Friendly">Swaminarayan / No Onion-Garlic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                    >
                      <option value="Family Dinner & Buffet">Family Dinner / Grand Buffet</option>
                      <option value="Birthday / Anniversary">Birthday / Anniversary Celebration</option>
                      <option value="Ring Ceremony / Engagement">Ring Ceremony / Engagement</option>
                      <option value="Corporate Group Dining">Corporate Group Dining</option>
                      <option value="Kitty Party / Society Meet">Kitty Party / Society Gathering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    Special Seating or Cake / Decor Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g., Wheelchair elevator access at Hilltown Plaza, high-chair for child, or separate Jain starter service..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5E0D8] rounded-lg focus:outline-none focus:border-[#9E2A2B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-[#9E2A2B] hover:bg-[#822021] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {mode === 'banquet'
                    ? 'Confirm Banquet Inquiry & Generate Quote Pass'
                    : 'Confirm Table Reservation at Hilltown Plaza'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Info inside Drawer */}
        <div className="p-6 border-t border-[#E5E0D8] bg-[#F2EFE9]/60 text-xs text-[#5C5852] space-y-1">
          <div className="font-semibold text-[#141413]">
            Thaath Maath Reception Desk · Hilltown Plaza, 3rd Floor
          </div>
          <div>
            Near Amar Jawan Circle, Sardar Patel Ring Road, Nikol, Ahmedabad 380049
          </div>
          <div className="font-mono-num">
            Direct Line: {RESTAURANT_INFO.phonePrimary} · Zero advance fee for table bookings
          </div>
        </div>
      </div>
    </div>
  );
};
