import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Building
} from 'lucide-react';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { TimetableSlot } from '../types';

export const TimetableSchedule: React.FC = () => {
  const { timetable, addTimetableSlot } = useResources();
  const { currentUser, permissions } = useAuth();

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [onlyMyCourses, setOnlyMyCourses] = useState<boolean>(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

  // New slot form state
  const [courseCode, setCourseCode] = useState('CS 302');
  const [courseName, setCourseName] = useState('Distributed Systems & Cloud Computing');
  const [room, setRoom] = useState('Cloud Computing Cluster Lab 2');
  const [lecturerName, setLecturerName] = useState(currentUser.displayName);
  const [dayOfWeek, setDayOfWeek] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('13:00');
  const [classType, setClassType] = useState<'Lecture' | 'Lab' | 'Tutorial'>('Lecture');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const filteredSlots = useMemo(() => {
    return timetable.filter(slot => {
      if (selectedDay !== 'all' && slot.dayOfWeek !== selectedDay) {
        return false;
      }
      if (selectedYear !== 'all' && slot.yearLevel !== selectedYear) {
        return false;
      }
      if (onlyMyCourses && !slot.courseCode.startsWith('CS') && !slot.courseCode.startsWith('MATH')) {
        return false;
      }
      return true;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetable, selectedDay, selectedYear, onlyMyCourses]);

  const handleExportIcs = () => {
    const calendarContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mwangaza School//Academic Hub 2024//EN
CALSCALE:GREGORIAN
${filteredSlots.map(s => `BEGIN:VEVENT
SUMMARY:${s.courseCode} - ${s.courseName} (${s.classType})
LOCATION:${s.room}
DESCRIPTION:Lecturer: ${s.lecturerName}
STATUS:CONFIRMED
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mwangaza_Schedule_${selectedDay}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addTimetableSlot({
      courseCode: courseCode.toUpperCase(),
      courseName,
      department: 'School of Computing & Informatics',
      yearLevel: 'Year 2',
      lecturerName,
      room,
      dayOfWeek,
      startTime,
      endTime,
      classType,
      status: 'upcoming'
    });
    setIsAddSlotOpen(false);
  };

  const getClassTypeBadge = (type: 'Lecture' | 'Lab' | 'Tutorial') => {
    switch (type) {
      case 'Lecture':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Lab':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Tutorial':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <CalendarIcon className="w-4 h-4" />
            Mwangaza School Master Timetable & Venue Scheduler
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Academic Schedule & Lecture Venues
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live conflict-free timetable view synchronized with faculty lecture halls and science laboratories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportIcs}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export to .ICS
          </button>

          {permissions.canManageTimetable && (
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Class Slot
            </button>
          )}
        </div>
      </div>

      {/* Controls & Day Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Days Pill Navigation */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Full Week Overview
            </button>

            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  selectedDay === d
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Quick Enrolled Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyMyCourses}
                onChange={e => setOnlyMyCourses(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700"
              />
              <span>My Registered Units (CS / Math)</span>
            </label>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Year Levels</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedule Slots Timeline / Grid */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No scheduled sessions for this selection</p>
            <p className="text-xs text-slate-500 mt-1">Try toggling to "Full Week Overview" or unchecking filter constraints.</p>
          </div>
        ) : (
          filteredSlots.map(slot => (
            <div
              key={slot.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm group"
            >
              {/* Time block */}
              <div className="flex items-start md:items-center gap-4">
                <div className="w-28 flex-shrink-0 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                    {slot.dayOfWeek}
                  </span>
                  <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {slot.courseCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getClassTypeBadge(slot.classType)}`}>
                      {slot.classType}
                    </span>
                    {slot.status === 'ongoing' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        In Session
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {slot.courseName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {slot.room}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {slot.lecturerName}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{slot.yearLevel}</span>
                  </div>
                </div>
              </div>

              {/* Status / Quick Action */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {slot.department}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Faculty Add Slot Modal */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Add New Timetable Schedule Slot
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Allocate lecture hall or laboratory session in the master institutional catalog.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Room</label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lecturer</label>
                  <input
                    type="text"
                    required
                    value={lecturerName}
                    onChange={e => setLecturerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Day</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
