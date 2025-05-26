
import React, { useState } from 'react';
import { CalendarEvent, ScheduledPost } from '../../types'; // Assuming types.ts has CalendarEvent

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (eventInfo: { event: { id: string, title: string, start: Date, extendedProps: { resource: ScheduledPost } } }) => void;
  darkMode?: boolean;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick, darkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday of the first week

  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday of the last week

  const datesArray: Date[] = [];
  let tempDate = new Date(startDate);
  while (tempDate <= endDate) {
    datesArray.push(new Date(tempDate));
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const cellHeight = "min-h-[6rem] sm:min-h-[7rem]"; // h-24 or h-28
  const cellBaseClasses = `p-1.5 border text-xs sm:text-sm overflow-hidden relative ${cellHeight}`;
  const dayNumberBaseClasses = "mb-1 font-medium";

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-1 sm:p-2 rounded-lg shadow`}>
      <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
        <button onClick={handlePrevMonth} className={`px-2 py-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>&lt; Prev</button>
        <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-semibold text-center">{startOfMonth.toLocaleString('default', { month: 'long' })} {startOfMonth.getFullYear()}</h2>
            <button onClick={handleToday} className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>Today</button>
        </div>
        <button onClick={handleNextMonth} className={`px-2 py-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>Next &gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-px border-l border-t ${darkMode ? 'border-slate-700' : 'border-gray-300'}">
        {daysOfWeek.map(day => (
          <div key={day} className={`text-center py-1.5 font-medium text-xs sm:text-sm border-r border-b ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>
            {day}
          </div>
        ))}
      
        {datesArray.map((dateCell, index) => {
          const isCurrentMonth = dateCell.getMonth() === currentDate.getMonth();
          const isToday = dateCell.toDateString() === new Date().toDateString();
          
          const dayEvents = events.filter(event => 
            new Date(event.start).toDateString() === dateCell.toDateString()
          );

          return (
            <div 
              key={index} 
              className={`${cellBaseClasses} ${isCurrentMonth ? (darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300') : (darkMode ? 'bg-slate-800/50 border-slate-700/70 text-slate-500' : 'bg-gray-50 border-gray-300/70 text-gray-400')}`}
            >
              <div className={`${dayNumberBaseClasses} ${isToday ? (darkMode ? 'text-accent-400 font-bold' : 'text-primary-600 font-bold') : (isCurrentMonth ? (darkMode ? 'text-slate-200' : 'text-gray-700') : '')}`}>
                {dateCell.getDate()}
              </div>
              <div className="space-y-0.5 text-[0.6rem] sm:text-xs leading-tight">
                {dayEvents.slice(0,3).map(event => { // Show max 3 events per day for space
                   const platformColorStyle = event.platformColor ? { backgroundColor: event.platformColor } : {};
                   const platformColorClass = event.platformColor || (darkMode ? 'bg-slate-600' : 'bg-gray-200');

                   return (
                    <div 
                      key={event.id} 
                      onClick={() => onEventClick({ event: { id: event.id, title: event.title, start: event.start, extendedProps: { resource: event.resource as ScheduledPost } } })}
                      className={`p-0.5 rounded truncate cursor-pointer ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} ${event.resource?.geminiGenerated ? 'border-l-2 border-accent-500 dark:border-accent-400' : ''}`}
                      title={event.title}
                    >
                     <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${platformColorClass}`} style={platformColorStyle}></span>
                      {event.title}
                    </div>
                   );
                })}
                {dayEvents.length > 3 && <div className="text-center text-gray-400 dark:text-slate-500 text-[0.55rem] sm:text-[0.65rem] mt-0.5">+{dayEvents.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
