import './App.css';
import { useState, useEffect } from 'react';
import moment from 'moment';

function App() {
  const [employeeAmount, setEmployeeAmount] = useState('');
  const [employeeStartTimes, setEmployeeStartTimes] = useState([]);
  const [employeeEndTimes, setEmployeeEndTimes] = useState([]);
  const [totalHours, setTotalHours] = useState([]);
  const [tipAmount, setTipAmount] = useState('');
  const [totalTips, setTotalTips] = useState([]);
  const [saveTime, setSaveTime] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('shiftData'));
    if (savedData) {
      setEmployeeAmount(savedData.employeeAmount);
      setEmployeeStartTimes(savedData.employeeStartTimes);
      setEmployeeEndTimes(savedData.employeeEndTimes);
      setTotalHours(savedData.totalHours);
      setTipAmount(savedData.tipAmount);
      setTotalTips(savedData.totalTips);
      setSaveTime(savedData.saveTime);
    }
  }, []);

  const employees = [
    { id: 1, name: 'ls' },
    { id: 2, name: 'pv' },
    { id: 3, name: 'cm' },
    { id: 4, name: 'lc' },
    { id: 5, name: 'as' },
    { id: 6, name: 'hp' },
    { id: 7, name: 'ra' },
    { id: 8, name: 'bm' },
    { id: 9, name: 'am' },
    { id: 10, name: 'rm' },
    { id: 11, name: 'fc' },
  ];

  const handleEmployeeAmountChange = (event) => {
    const amount = parseInt(event.target.value);
    setEmployeeAmount(amount);
    const initialTimes = Array.from({ length: amount }, () => ({ startTime: '', endTime: '', employeeId: '' }));
    setEmployeeStartTimes(initialTimes);
    setEmployeeEndTimes(initialTimes);
    setTotalHours(Array.from({ length: amount }, () => 0));
    setTotalTips(Array.from({ length: amount }, () => 0));
  };

  const handleEmployeeStartTime = (index, event) => {
    const startTime = event.target.value;
    const updatedTimes = [...employeeStartTimes];
    updatedTimes[index] = { ...updatedTimes[index], startTime };
    setEmployeeStartTimes(updatedTimes);
    updateTotalHours(index, startTime, employeeEndTimes[index]?.endTime);
  };

  const handleEmployeeEndTime = (index, event) => {
    const endTime = event.target.value;
    const updatedTimes = [...employeeEndTimes];
    updatedTimes[index] = { ...updatedTimes[index], endTime };
    setEmployeeEndTimes(updatedTimes);
    updateTotalHours(index, employeeStartTimes[index]?.startTime, endTime);
  };

  const handleEndTimeShortcut = (selectedTime) => {
    const updatedEndTimes = employeeEndTimes.map(() => ({ endTime: selectedTime }));
    setEmployeeEndTimes(updatedEndTimes);
    updateTotalHoursForAll(selectedTime);
  };

  const handleTipAmountChange = (event) => {
    setTipAmount(parseFloat(event.target.value));
  };

  const updateTotalHours = (index, startTime, endTime) => {
    if (startTime && endTime) {
      const start = moment(`2024-01-01 ${startTime}`, 'YYYY-MM-DD hh:mm A');
      const end = moment(`2024-01-01 ${endTime}`, 'YYYY-MM-DD hh:mm A');
      const hours = end.diff(start, 'hours', true);
      const updatedTotalHours = [...totalHours];
      updatedTotalHours[index] = hours;
      setTotalHours(updatedTotalHours);
    }
  };

  const updateTotalHoursForAll = (selectedTime) => {
    const updatedTotalHours = totalHours.map(() => {
      if (employeeStartTimes.length > 0 && employeeStartTimes[0]?.startTime) {
        const start = new Date(`2024-01-01 ${employeeStartTimes[0]?.startTime}`).getTime();
        const end = new Date(`2024-01-01 ${selectedTime}`).getTime();
        return (end - start) / (1000 * 60 * 60);
      }
      return 0;
    });
    setTotalHours(updatedTotalHours);
  };

  const handleSave = () => {
    const shiftData = {
      employeeAmount,
      employeeStartTimes,
      employeeEndTimes,
      totalHours,
      tipAmount,
      totalTips,
      saveTime: new Date().toLocaleString(),
    };
    localStorage.setItem('shiftData', JSON.stringify(shiftData));
    setSaveTime(shiftData.saveTime);
  };

  const handleClear = () => {
    localStorage.removeItem('shiftData');
    setEmployeeAmount('');
    setEmployeeStartTimes([]);
    setEmployeeEndTimes([]);
    setTotalHours([]);
    setTipAmount('');
    setTotalTips([]);
    setSaveTime('');
  };

  const handleSubmit = () => {
    const updatedTotalTips = totalHours.map(hours => parseFloat((hours / totalHours.reduce((acc, cur) => acc + cur, 0)) * tipAmount).toFixed(2));
    setTotalTips(updatedTotalTips);
    handleSave();
  };

  const handleEmployeeNameChange = (index, event) => {
    const selectedEmployeeId = event.target.value;
    const updatedTimes = [...employeeStartTimes];
    updatedTimes[index] = { ...updatedTimes[index], employeeId: selectedEmployeeId };
    setEmployeeStartTimes(updatedTimes);
  };

  return (
    <div className="">
      <div>
        <p>How many Employees</p>
        <select className="employee-select" value={employeeAmount} onChange={handleEmployeeAmountChange}>
          <option value="">0</option>
          {[...Array(11)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {Array.from({ length: parseInt(employeeAmount) }).map((_, index) => (
          <div className='employee-information' key={index}>
            <div className='employee-select'>
              <div>
                <p>Start Time</p>
                <select
                  className='employee-startTime'
                  onChange={(event) => handleEmployeeStartTime(index, event)}
                  value={employeeStartTimes[index]?.startTime || ''}
                >
                  <option value=""></option>
                  {['11:00 AM', '11:30 AM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM'].map((time, idx) => (
                    <option key={idx} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <p>End Time</p>
                <select
                  className='employee-endTime'
                  onChange={(event) => handleEmployeeEndTime(index, event)}
                  value={employeeEndTimes[index]?.endTime || ''}
                >
                  <option value=""></option>
                  {['11:00 AM', '11:30 AM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM'].map((time, idx) => (
                    <option key={idx} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <p>Total Hours</p>
                <input className='employee-totalHours' value={totalHours[index] || ''} readOnly />
              </div>
              <div>
                <p>Employee</p>
                <select
                  name={`employee${index}`}
                  id={`employee${index}`}
                  onChange={(event) => handleEmployeeNameChange(index, event)}
                  value={employeeStartTimes[index]?.employeeId || ''}
                >
                  <option value=""></option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <p>Total Tip: {totalTips[index]}</p>
          </div>
        ))}
      </div>

      <div>
        <p>Tip Amount</p>
        <input className="tip-amount" type="number" step="0.01" value={tipAmount} onChange={handleTipAmountChange} />
      </div>

      <div className='button-container'>
        <button className='button' onClick={handleSubmit}>Submit</button>
        <button className='button' onClick={handleSave}>Save</button>
        <button className='button' onClick={handleClear}>Clear</button>
      </div>

      <div className='result'>
        <p>Total Tips: ${totalTips.reduce((acc, cur) => acc + parseFloat(cur), 0).toFixed(2)}</p>
      </div>

      <div className='end-time-shortcut'>
        <p>End Time Shortcut:</p>
        <select onChange={(e) => handleEndTimeShortcut(e.target.value)}>
          <option value="">Select Time</option>
          {['11:00 AM', '11:30 AM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM'].map((time, idx) => (
            <option key={idx} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <div className='save-time'>
        <p>Last Save Time: {saveTime}</p>
      </div>
    </div>
  );
}

export default App;
