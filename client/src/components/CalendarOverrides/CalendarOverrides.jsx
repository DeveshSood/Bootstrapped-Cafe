import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const categorizeIngredients = (ingredients) => {
  if (!ingredients || !Array.isArray(ingredients)) return {};
  const categories = {
    'Protein': [],
    'Curry of the day': [],
    'Salads': [],
    'Phytos': [],
    'Complex Carbs': [],
    'Base & Toppings': []
  };
  
  ingredients.forEach(ing => {
    const lower = ing.toLowerCase();
    if (lower.includes('chicken') || lower.includes('paneer') || lower.includes('egg') || lower.includes('tofu') || lower.includes('fish')) {
      categories['Protein'].push(ing);
    } else if (lower.includes('rice') || lower.includes('quinoa') || lower.includes('millets') || lower.includes('oats')) {
      categories['Complex Carbs'].push(ing);
    } else if (lower.includes('dal') || lower.includes('rajma') || lower.includes('chana') || lower.includes('chickpea') || lower.includes('curry') || lower.includes('stew')) {
      categories['Curry of the day'].push(ing);
    } else if (lower.includes('salsa') || lower.includes('salad') || lower.includes('hummus') || lower.includes('beans') || lower.includes('cucumber') || lower.includes('lettuce') || lower.includes('tomato') || lower.includes('onion') || lower.includes('cabbage')) {
      categories['Salads'].push(ing);
    } else if (lower.includes('broccoli') || lower.includes('capsicum') || lower.includes('zucchini') || lower.includes('carrot') || lower.includes('cauliflower') || lower.includes('mushroom') || lower.includes('bhindi') || lower.includes('gobi') || lower.includes('bell pepper') || lower.includes('bellpeper') || lower.includes('bellpeppers')) {
      categories['Phytos'].push(ing);
    } else {
      categories['Base & Toppings'].push(ing);
    }
  });
  
  const result = {};
  for (const [key, value] of Object.entries(categories)) {
    if (value.length > 0) result[key] = value;
  }
  return result;
};

export default function CalendarOverrides({ overrides, schedule, onShowNutrition, onDeleteOverride }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayOverride, setSelectedDayOverride] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleYearChange = (e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  const handleMonthChange = (e) => setCurrentDate(new Date(year, parseInt(e.target.value), 1));

  // Calendar logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  const getFormatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDayClick = (day) => {
    const dateStr = getFormatDate(day);
    if (overrides[dateStr]) {
      setSelectedDayOverride(overrides[dateStr]);
    } else {
      setSelectedDayOverride(null);
    }
  };

  // Compute Diff
  const computeDiff = (overrideData, dateStr) => {
    // Find the default schedule day
    const dateObj = new Date(dateStr);
    const dayIndex = dateObj.getUTCDay();
    const defaultDay = schedule.find(s => s.dayIndex === dayIndex);
    
    if (!defaultDay) return null;
    const defaultMenu = defaultDay.menu;
    
    const changes = [];
    
    const defaultBowls = defaultMenu.menuItems || [];
    const overrideBowls = overrideData.overrideData?.menuItems || [];
    
    overrideBowls.forEach(oBowl => {
      const dBowl = defaultBowls.find(b => b.name === oBowl.name);
      if (!dBowl) {
        changes.push(`Added bowl: ${oBowl.name}`);
      } else {
        const dIngs = [...(dBowl.ingredients || [])].sort().join(',');
        const oIngs = [...(oBowl.ingredients || [])].sort().join(',');
        if (dIngs !== oIngs) {
          changes.push(`Modified ingredients for ${oBowl.name}`);
        }
      }
    });
    
    defaultBowls.forEach(dBowl => {
      const oBowl = overrideBowls.find(b => b.name === dBowl.name);
      if (!oBowl) {
        changes.push(`Removed bowl: ${dBowl.name}`);
      }
    });

    return changes.length > 0 ? changes : ['Customized salad options.'];
  };

  return (
    <div style={{ marginTop: '50px', background: 'var(--white)', padding: '32px 24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ color: 'var(--forest-green)', fontSize: '1.8rem', fontFamily: 'var(--font-display)', margin: 0 }}>Menu Overrides</h3>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button variant="outlined" onClick={handlePrevMonth} style={{ padding: '6px 12px' }}>&larr;</Button>
          
          <select value={month} onChange={handleMonthChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--cream-light)', fontFamily: 'inherit', fontWeight: 'bold' }}>
            {MONTHS.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
          </select>
          
          <select value={year} onChange={handleYearChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--cream-light)', fontFamily: 'inherit', fontWeight: 'bold' }}>
            {[year - 1, year, year + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <Button variant="outlined" onClick={handleNextMonth} style={{ padding: '6px 12px' }}>&rarr;</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.85rem', paddingBottom: '8px' }}>{d}</div>
        ))}
        
        {blanksArray.map(b => (
          <div key={`blank-${b}`} style={{ background: '#f9f9f9', borderRadius: '8px', minHeight: '80px', border: '1px dashed #eee' }}></div>
        ))}
        
        {daysArray.map(day => {
          const dateStr = getFormatDate(day);
          const isOverride = !!overrides[dateStr];
          const isToday = dateStr === new Date().toLocaleDateString('en-CA');
          
          return (
            <div 
              key={day}
              onClick={() => handleDayClick(day)}
              style={{ 
                background: isOverride ? '#FFF9C4' : '#E8F5E9', 
                borderRadius: '8px', 
                minHeight: '80px', 
                padding: '8px',
                border: isToday ? '2px solid var(--forest-green)' : (isOverride ? '1px solid #FBC02D' : '1px solid #A5D6A7'),
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isOverride ? '#F57F17' : 'var(--forest-green)' }}>{day}</div>
              {isOverride && (
                <div style={{ marginTop: 'auto', fontSize: '0.65rem', background: '#F57F17', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                  OVERRIDE
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedDayOverride && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDayOverride(null); }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ background: 'white', borderRadius: '16px', maxWidth: '1000px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #FBC02D', background: '#FFF9C4', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{ fontFamily: 'var(--font-display)', color: '#F57F17', margin: 0 }}>Menu Override: {selectedDayOverride.date}</h2>
                 <button 
                  onClick={() => setSelectedDayOverride(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#F57F17', padding: '4px', lineHeight: 1 }}
                 >
                   &times;
                 </button>
              </div>
              
              <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                
                {/* Original Menu Side */}
                <div style={{ flex: '1 1 300px', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h4 style={{ margin: '0 0 16px 0', color: 'var(--forest-green)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Original Menu</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(() => {
                      const dateObj = new Date(selectedDayOverride.date);
                      const dayIndex = dateObj.getUTCDay();
                      const defaultDay = schedule.find(s => s.dayIndex === dayIndex);
                      const dBowls = defaultDay?.menu?.menuItems || [];
                      
                      return dBowls.map(b => (
                        <div key={b.name} style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--espresso)', marginBottom: '4px' }}>{b.name}</div>
                          <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', lineHeight: '1.4' }}>
                            {(() => {
                              const cats = categorizeIngredients(b.ingredients || []);
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {Object.entries(cats).map(([cName, cItems]) => (
                                    <div key={cName}>
                                      <span style={{ fontWeight: 'bold', color: 'var(--espresso)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{cName}: </span>
                                      <span style={{ color: 'var(--text-dark)', fontSize: '0.75rem' }}>{cItems.join(', ')}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Overridden Menu Side */}
                <div style={{ flex: '1 1 300px', background: '#FFF9C4', padding: '20px', borderRadius: '12px', border: '1px solid #FBC02D' }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#F57F17', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Overridden Menu</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(() => {
                      const dateObj = new Date(selectedDayOverride.date);
                      const dayIndex = dateObj.getUTCDay();
                      const defaultDay = schedule.find(s => s.dayIndex === dayIndex);
                      const dBowls = defaultDay?.menu?.menuItems || [];
                      const oBowls = selectedDayOverride.overrideData?.menuItems || [];
                      
                      return oBowls.map(b => {
                        const dBowl = dBowls.find(d => d.name === b.name);
                        const isNew = !dBowl;
                        const isModified = dBowl && [...(dBowl.ingredients || [])].sort().join(',') !== [...(b.ingredients || [])].sort().join(',');
                        
                        return (
                          <div key={b.name} style={{ padding: '12px', background: 'white', borderRadius: '8px', border: isNew ? '2px solid #4CAF50' : (isModified ? '2px solid #FF9800' : '1px solid #E2E8F0') }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--espresso)' }}>{b.name}</div>
                              {isNew && <span style={{ background: '#4CAF50', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold' }}>NEW</span>}
                              {isModified && <span style={{ background: '#FF9800', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold' }}>MODIFIED</span>}
                            </div>
                            <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', lineHeight: '1.4' }}>
                              {(() => {
                                const cats = categorizeIngredients(b.ingredients || []);
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {Object.entries(cats).map(([cName, cItems]) => (
                                      <div key={cName}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--espresso)', fontSize: '0.7rem', textTransform: 'uppercase' }}>{cName}: </span>
                                        <span style={{ color: 'var(--text-dark)', fontSize: '0.75rem' }}>{cItems.join(', ')}</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                </div>
              </div>

              <div style={{ padding: '16px 32px', background: 'var(--cream-light)', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexShrink: 0 }}>
                <Button 
                  variant="outlined" 
                  style={{ borderColor: 'var(--terracotta)', color: 'var(--terracotta)' }}
                  onClick={() => {
                    onDeleteOverride(selectedDayOverride.date);
                    setSelectedDayOverride(null);
                  }}
                >
                  Delete Override
                </Button>
                <Button 
                  variant="filled" 
                  onClick={() => {
                    onShowNutrition({ title: selectedDayOverride.date, menu: selectedDayOverride.overrideData });
                    setSelectedDayOverride(null);
                  }}
                >
                  View Nutrition
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
