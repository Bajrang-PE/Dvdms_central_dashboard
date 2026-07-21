import React, { useState } from 'react';

const CalendarModal = ({ onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); 

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // 2026 की सरकारी छुट्टियां
    const holidaysData = {
        2026: {
            0: [{ day: 26, name: "Republic Day (G)" }],
            2: [{ day: 20, name: "Id-ul-Fitr (G)" }],
            5: [{ day: 26, name: "Muharram (G)" }], // 26 जून मुहर्रम की छुट्टी
            7: [{ day: 15, name: "Independence Day (G)" }],
            9: [{ day: 2, name: "Mahatma Gandhi's Birthday (G)" }, { day: 22, name: "Dussehra (G)" }],
            10: [{ day: 8, name: "Diwali (Deepavali) (G)" }]
        }
    };

    const currentMonthHolidays = holidaysData[year]?.[month] || [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const today = new Date();
    const isCurrentMonthAndYear = today.getFullYear() === year && today.getMonth() === month;

    // रिएक्ट ऑब्जेक्ट सिंटैक्स के अनुसार पूरी तरह सुधारी गई स्टाइल्स
    const styles = {
        overlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            backdropFilter: 'blur(2px)', padding: '20px'
        },
        content: {
            backgroundColor: '#f4f5f7', borderRadius: '8px', width: '100%', maxWidth: '780px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.2)', overflow: 'hidden', 
            position: 'relative', padding: '25px 40px 40px 40px'
        },
        topTitleZone: { textAlign: 'center', marginBottom: '25px', position: 'relative' },
        h2Title: {
            fontSize: '28px', fontWeight: '700', color: '#000000', margin: 0,
            display: 'inline-block', borderBottom: '3px solid #0052cc', paddingBottom: '5px'
        },
        h3Title: { fontSize: '20px', fontWeight: '700', color: '#222', margin: '10px 0 0 0' },
        closeX: {
            position: 'absolute', right: '-20px', top: '-10px', background: 'none',
            border: 'none', fontSize: '35px', cursor: 'pointer', color: '#666'
        },
        notebook: {
            backgroundColor: '#ffffff', borderRadius: '4px',
            border: '1px solid #dcdcdc', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            position: 'relative', marginTop: '15px'
        },
        spiralsContainer: {
            position: 'absolute', top: '-14px', left: '20px', right: '20px',
            display: 'flex', justifyContent: 'space-between', zIndex: 10, pointerEvents: 'none'
        },
        spiralRing: {
            width: '8px', height: '26px', background: 'linear-gradient(to right, #e0e0e0, #ffffff, #b5b5b5)',
            borderRadius: '4px', border: '1px solid #adadad', boxShadow: '1px 2px 3px rgba(0,0,0,0.15)'
        },
        bodyLayout: { padding: '30px 25px 25px 25px', display: 'flex', gap: '20px' },
        calendarView: { flex: 1.3, paddingRight: '5px' },
        navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
        yearDisplay: { fontSize: '18px', fontWeight: '700', color: '#436cc9', letterSpacing: '1px' },
        monthControls: { display: 'flex', alignItems: 'center', gap: '15px' },
        monthTitleText: { fontWeight: '700', fontSize: '22px', color: '#436cc9', minWidth: '100px', textAlign: 'center' },
        arrowBtn: { background: 'none', border: 'none', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer', color: '#a0aec0' },
        gridHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#2b6cb0', padding: '1px' },
        dayName: { color: '#ffffff', fontWeight: '700', fontSize: '11px', textAlign: 'center', padding: '8px 0' },
        gridDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#cbd5e0', border: '1px solid #cbd5e0' },
        dayCell: { background: '#ffffff', padding: '12px 0', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#2d3748' },
        emptyCell: { background: '#f7fafc' },
        selectedDay: { border: '2px solid #2b6cb0', fontWeight: '800', color: '#000' },
        holidayCell: { backgroundColor: '#cc0000', color: '#ffffff' },
        sidebarZone: { flex: 1, borderLeft: '1px solid #e2e8f0', paddingLeft: '25px', display: 'flex', flexDirection: 'column' },
        yellowHeader: { background: '#fff3cd', color: '#856404', padding: '10px 15px', fontSize: '14px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ffeeba' },
        scrollList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
        holidayItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '5px 0' },
        badge: { background: '#cc0000', color: 'white', width: '32px', height: '24px', display: 'flex', alignItems: 'center', justifycontent: 'center', borderRadius: '3px', fontWeight: 'bold', fontSize: '13px', flexShrink: 0 },
        holidayNameText: { fontSize: '13px', color: '#333', fontWeight: '600' },
        noHoliday: { fontSize: '13px', color: '#718096', fontStyle: 'italic', marginTop: '10px' }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.content} onClick={(e) => e.stopPropagation()}>
                
                {/* हेडर टाइटल */}
                <div style={styles.topTitleZone}>
                    <h2 style={styles.h2Title}>Holiday Calendar</h2>
                    <h3 style={styles.h3Title}>Central</h3>
                    <button style={styles.closeX} onClick={onClose}>&times;</button>
                </div>

                {/* डायरी / कैलेंडर कंटेनर */}
                <div style={styles.notebook}>
                    
                    {/* बाइंडिंग स्पाइरल छल्ले */}
                    <div style={styles.spiralsContainer}>
                        {[...Array(22)].map((_, i) => (
                            <span key={i} style={styles.spiralRing}></span>
                        ))}
                    </div>

                    <div style={styles.bodyLayout}>
                        {/* लेफ्ट side: ग्रिड व्यू */}
                        <div style={styles.calendarView}>
                            <div style={styles.navRow}>
                                <span style={styles.yearDisplay}>≡ {year}</span>
                                <div style={styles.monthControls}>
                                    <button onClick={handlePrevMonth} style={styles.arrowBtn}>&lt;</button>
                                    <span style={styles.monthTitleText}>{monthNames[month]}</span>
                                    <button onClick={handleNextMonth} style={styles.arrowBtn}>&gt;</button>
                                </div>
                            </div>

                            {/* दिनों के नाम पट्टी */}
                            <div style={styles.gridHeader}>
                                <div style={styles.dayName}>SUN</div>
                                <div style={styles.dayName}>MON</div>
                                <div style={styles.dayName}>TUE</div>
                                <div style={styles.dayName}>WED</div>
                                <div style={styles.dayName}>THU</div>
                                <div style={styles.dayName}>FRI</div>
                                <div style={styles.dayName}>SAT</div>
                            </div>

                            {/* तारीखें */}
                            <div style={styles.gridDays}>
                                {[...Array(firstDayOfMonth)].map((_, i) => (
                                    <div key={`empty-${i}`} style={{...styles.dayCell, ...styles.emptyCell}}></div>
                                ))}

                                {[...Array(daysInMonth)].map((_, i) => {
                                    const dayNum = i + 1;
                                    const holiday = currentMonthHolidays.find(h => h.day === dayNum);
                                    const isSelectedDay = isCurrentMonthAndYear && dayNum === 22; // आज की तारीख हाइलाइट करने के लिए

                                    let combinedStyle = { ...styles.dayCell };
                                    if (holiday) combinedStyle = { ...combinedStyle, ...styles.holidayCell };
                                    if (isSelectedDay) combinedStyle = { ...combinedStyle, ...styles.selectedDay };

                                    return (
                                        <div key={dayNum} style={combinedStyle}>
                                            {dayNum}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* राइट side: छुट्टी लिस्ट पैनल */}
                        <div style={styles.sidebarZone}>
                            <div style={styles.yellowHeader}>
                                <strong>Holidays</strong> of the Month
                            </div>
                            <div style={styles.scrollList}>
                                {currentMonthHolidays.length > 0 ? (
                                    currentMonthHolidays.map((h, idx) => (
                                        <div key={idx} style={styles.holidayItem}>
                                            <span style={styles.badge}>{h.day}</span>
                                            <span style={styles.holidayNameText}>{h.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={styles.noHoliday}>No gazetted holidays listed for this month.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;