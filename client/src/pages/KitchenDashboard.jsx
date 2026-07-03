import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGetSchedule, apiSetOverride, apiDeleteOverride } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Button from '../components/common/Button';
import CalendarOverrides from '../components/CalendarOverrides/CalendarOverrides';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function KitchenDashboard() {
  const { token, user } = useAuth();
  const toast = useToast();
  
  const [schedule, setSchedule] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideDate, setOverrideDate] = useState('');
  const [editData, setEditData] = useState(null);
  const [nutritionModalData, setNutritionModalData] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, [token]);

  const fetchSchedule = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await apiGetSchedule(token);
      
      // data.defaultSchedule is array of 7 days
      setSchedule(data.defaultSchedule || []);
      
      const overrideMap = {};
      if (data.overrides) {
        data.overrides.forEach(o => overrideMap[o.date] = o);
      }
      setOverrides(overrideMap);
    } catch (err) {
      toast.error('Failed to load kitchen schedule');
    } finally {
      setLoading(false);
    }
  };

  const openOverrideModal = (dayIndex) => {
    // Find the next occurrence of this day of the week
    const today = new Date();
    const todayIndex = today.getDay();
    let daysUntil = dayIndex - todayIndex;
    if (daysUntil <= 0) daysUntil += 7;
    
    const nextOccurrence = new Date(today);
    nextOccurrence.setDate(today.getDate() + daysUntil);
    const dateString = nextOccurrence.toISOString().split('T')[0];
    
    setOverrideDate(dateString);
    
    // Copy the default menu for this day as a starting point
    const defaultMenu = schedule.find(s => s.dayIndex === dayIndex)?.menu;
    setEditData(JSON.parse(JSON.stringify(defaultMenu || {})));
    setOverrideModalOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!overrideDate) return toast.error('Please select a date');
    try {
      await apiSetOverride(token, { 
        date: overrideDate, 
        menuItems: editData.menuItems,
        customSaladCategories: editData.customSalad?.categories,
        customSaladIngredients: editData.customSalad?.ingredients,
        categories: editData.categories
      });
      toast.success('Menu override saved for ' + overrideDate);
      setOverrideModalOpen(false);
      fetchSchedule(); // Refresh data
    } catch (err) {
      toast.error(err.message || 'Failed to save override');
    }
  };

  const handleIngredientChange = (catId, idx, newName) => {
    if (!editData || !editData.customSalad) return;
    
    // Find the full ingredient object from the schedule to preserve nutrition data
    let newIngredientObj = null;
    for (const day of schedule) {
      const ings = day.menu?.customSalad?.ingredients?.[catId] || [];
      const found = ings.find(i => i.name === newName);
      if (found) {
        newIngredientObj = JSON.parse(JSON.stringify(found));
        break;
      }
    }
    
    const oldName = editData.customSalad.ingredients[catId][idx].name;
    const newData = JSON.parse(JSON.stringify(editData));
    
    if (newIngredientObj) {
      newData.customSalad.ingredients[catId][idx] = newIngredientObj;
    } else {
      newData.customSalad.ingredients[catId][idx].name = newName;
    }
    
    // Automatically update the standard bowls that use this ingredient
    if (newData.menuItems) {
      newData.menuItems.forEach(meal => {
        if (meal.ingredients) {
          meal.ingredients = meal.ingredients.map(ing => {
            if (ing.startsWith(oldName + ' -') || ing === oldName) {
              return ing.replace(oldName, newName);
            }
            return ing;
          });
        }
      });
    }
    setEditData(newData);
  };

  const handleDeleteOverride = async (date) => {
    if (!window.confirm(`Are you sure you want to remove the override for ${date}?`)) return;
    try {
      await apiDeleteOverride(token, date);
      toast.success('Menu override removed.');
      fetchSchedule();
    } catch (err) {
      toast.error(err.message || 'Failed to delete override');
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', minHeight: '100vh', background: 'var(--cream)' }}>
        Loading Kitchen Dashboard...
      </div>
    );
  }

  const MenuCard = ({ title, menu, onShowNutrition, isOverride, onDelete }) => {
    const cats = menu?.customSalad?.categories || [];
    const ings = menu?.customSalad?.ingredients || {};
    
    return (
      <div style={{ background: 'var(--white)', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flex: '1 1 200px', maxWidth: '280px', position: 'relative' }}>
        {isOverride && onDelete && (
          <button 
            onClick={onDelete}
            style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            title="Remove Override"
          >
            &times;
          </button>
        )}
        <div style={{ borderBottom: '1px solid var(--cream-light)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: isOverride ? '#E65100' : 'var(--espresso)', fontSize: '1.3rem', textAlign: 'center' }}>{title}</h2>
        </div>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--terracotta)', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 'bold' }}>Changing Ingredients</h3>
          
          {cats.map(cat => {
            const catItems = ings[cat.id] || [];
            if (catItems.length === 0) return null;
            
            return (
              <div key={cat.id} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--forest-green)', marginBottom: '2px' }}>{cat.label}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: '600', lineHeight: '1.2' }}>
                  {catItems.map(item => (
                    <li key={item.id} style={{ paddingBottom: '1px' }}>{item.name}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <Button 
          variant="outlined"
          style={{ marginTop: '12px', padding: '6px', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
          onClick={() => onShowNutrition({ title, menu })}
        >
          View Nutrition
        </Button>
      </div>
    );
  };

  // Filter out Sunday (0) and Saturday (6)
  const displayDays = schedule.filter(s => s.dayIndex >= 1 && s.dayIndex <= 5);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '90px', paddingBottom: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest-green)', marginBottom: '4px', fontSize: '2.5rem', letterSpacing: '-0.02em' }}>Kitchen Dashboard</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <div style={{ height: '1px', width: '30px', background: 'var(--terracotta)' }}></div>
                <p style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', fontWeight: 'bold' }}>Weekly Rotating Menu Overview</p>
                <div style={{ height: '1px', width: '30px', background: 'var(--terracotta)' }}></div>
              </div>
            </div>
            
            <Button 
              variant="outlined" 
              style={{ fontSize: '0.85rem', padding: '6px 20px', borderColor: 'var(--terracotta)', color: 'var(--terracotta)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => openOverrideModal(1)}
            >
              CREATE OVERRIDE
            </Button>
          </div>
          
          {/* 5 Column Grid */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'stretch'
          }}>
            {displayDays.map((dayData) => (
              <MenuCard 
                key={dayData.dayIndex} 
                title={DAYS[dayData.dayIndex]} 
                menu={dayData.menu} 
                onShowNutrition={setNutritionModalData} 
              />
            ))}
          </div>

          {/* Show interactive overrides calendar at the bottom */}
          <CalendarOverrides 
            overrides={overrides} 
            schedule={schedule} 
            onShowNutrition={setNutritionModalData} 
            onDeleteOverride={handleDeleteOverride} 
          />

        </div>
      </div>
      
      {/* Override Modal */}
      <AnimatePresence>
        {overrideModalOpen && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOverrideModalOpen(false);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ position: 'relative', background: 'white', borderRadius: '16px', width: '90%', maxWidth: '1000px', maxHeight: '90vh', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ padding: '24px 24px 16px 24px', flexShrink: 0, borderBottom: '1px solid var(--cream-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, color: 'var(--espresso)', fontSize: '1.5rem' }}>Create Menu Override</h2>
                <button 
                  onClick={() => setOverrideModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)', padding: '4px', lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--espresso)', marginBottom: '8px' }}>Select Specific Date to Override</label>
                    <input 
                      type="date" 
                      value={overrideDate}
                      onChange={(e) => {
                        const newDateStr = e.target.value;
                        setOverrideDate(newDateStr);
                        const d = new Date(newDateStr);
                        const dayIndex = d.getDay();
                        const defaultMenu = schedule.find(s => s.dayIndex === dayIndex)?.menu;
                        if (defaultMenu) {
                          setEditData(JSON.parse(JSON.stringify(defaultMenu)));
                        }
                      }}
                      style={{ width: '100%', maxWidth: '300px', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '1rem' }}
                    />
                  </div>
                  
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '12px' }}>Swap ingredients for this date. The standard bowls will automatically update.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {editData && editData.customSalad && editData.customSalad.categories.map(cat => {
                        
                        const allPossible = new Set();
                        schedule.forEach(day => {
                          const ings = day.menu?.customSalad?.ingredients?.[cat.id] || [];
                          ings.forEach(i => allPossible.add(i.name));
                        });
                        const masterList = Array.from(allPossible);
                        
                        const activeItems = editData.customSalad.ingredients[cat.id] || [];
                        const inactiveAlternatives = masterList.filter(alt => !activeItems.some(i => i.name === alt));
                        
                        return (
                          <div key={cat.id} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--cream-light)' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--forest-green)', marginBottom: '8px', textTransform: 'uppercase' }}>{cat.label}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {activeItems.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ 
                                     background: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', 
                                     borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', flex: 1,
                                     border: '1px solid #C8E6C9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                  }}>
                                    {item.name}
                                  </span>
                                  
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) handleIngredientChange(cat.id, idx, e.target.value);
                                    }}
                                    style={{ 
                                      padding: '4px 6px', borderRadius: '6px', border: '1px solid #FFCDD2', 
                                      background: '#FFEBEE', color: '#C62828', fontWeight: 'bold', fontSize: '0.75rem',
                                      cursor: 'pointer', maxWidth: '100px'
                                    }}
                                  >
                                    <option value="">Swap...</option>
                                    {inactiveAlternatives.map(alt => (
                                      <option key={alt} value={alt}>{alt}</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Live Nutrition Preview */}
                <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#166534', marginBottom: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✨</span> Live Nutrition Preview
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {editData && editData.customSalad && editData.customSalad.categories.map(cat => {
                      const items = editData.customSalad.ingredients[cat.id] || [];
                      if (items.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <h4 style={{ fontSize: '0.75rem', color: '#15803D', textTransform: 'uppercase', marginBottom: '6px', borderBottom: '1px solid #DCFCE7', paddingBottom: '4px' }}>{cat.label}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                                <span style={{ fontWeight: 'bold', maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--espresso)' }}>{item.name}</span>
                                <div style={{ display: 'flex', gap: '10px', color: '#166534' }}>
                                  <span title="Calories">🔥 {item.nutrition?.calories || 0}</span>
                                  <span title="Protein">🥩 {item.nutrition?.protein || 0}</span>
                                  <span title="Carbs">🌾 {item.nutrition?.carbs || 0}</span>
                                  <span title="Fat">🥑 {item.nutrition?.fat || 0}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
              
              <div style={{ padding: '16px 24px', background: 'var(--cream-light)', flexShrink: 0, display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => setOverrideModalOpen(false)}>Cancel</Button>
                <Button variant="filled" onClick={handleSaveOverride} disabled={typeof editData === 'string'}>
                  Save Override
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nutrition Modal */}
      <AnimatePresence>
        {nutritionModalData && (
          <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'opacity' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setNutritionModalData(null);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ position: 'relative', background: 'white', borderRadius: '16px', width: '95%', maxWidth: '1200px', maxHeight: '90vh', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', willChange: 'transform, opacity' }}
            >
              <div style={{ padding: '24px 24px 16px 24px', flexShrink: 0, borderBottom: '1px solid var(--cream-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', color: 'var(--espresso)', fontSize: '1.5rem' }}>{nutritionModalData.title} Nutrition</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Detailed breakdown of ingredients.</p>
                </div>
                <button 
                  onClick={() => setNutritionModalData(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)', padding: '4px', lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Standard Bowls Nutrition */}
                {nutritionModalData.menu.menuItems && nutritionModalData.menu.menuItems.length > 0 && (
                  <div style={{ border: '1px solid var(--cream-light)', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--terracotta)', textTransform: 'uppercase' }}>Standard Bowls</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {nutritionModalData.menu.menuItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', background: '#FFF5F3', padding: '16px', borderRadius: '12px', gap: '12px', border: '1px solid #FFE0B2' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--espresso)' }}>{item.name}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dark)', justifyContent: 'space-between', background: 'rgba(255,255,255,0.6)', padding: '10px 16px', borderRadius: '8px' }}>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>🔥</span> {item.nutrition?.calories || 0}kcal</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>🥩</span> {item.nutrition?.protein || 0}g</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: '#D4AF37', fontWeight: 'bold'}}>🌾</span> {item.nutrition?.carbs || 0}g</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>🥑</span> {item.nutrition?.fat || 0}g</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dark)', justifyContent: 'space-between', background: 'rgba(255,255,255,0.6)', padding: '10px 16px', borderRadius: '8px' }}>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>💊 Vit C:</span> {item.nutrition?.vitC || 0}mg</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>💊 Vit E:</span> {item.nutrition?.vitE || 0}mg</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: '#D4AF37', fontWeight: 'bold'}}>💊 Folate:</span> {item.nutrition?.folate || 0}mcg</span>
                              <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>💊 Vit B6:</span> {item.nutrition?.vitB6 || 0}mg</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Custom Salad Ingredients Nutrition */}
                {nutritionModalData.menu.customSalad.categories.map(cat => {
                  const items = nutritionModalData.menu.customSalad.ingredients[cat.id] || [];
                  if (items.length === 0) return null;
                  return (
                    <div key={cat.id} style={{ border: '1px solid var(--cream-light)', borderRadius: '8px', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--forest-green)', textTransform: 'uppercase' }}>{cat.label}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map(item => (
                          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', background: '#F8FAFC', padding: '16px', borderRadius: '12px', gap: '12px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--espresso)' }}>{item.name}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dark)', justifyContent: 'space-between', background: 'rgba(255,255,255,0.7)', padding: '10px 16px', borderRadius: '8px' }}>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>🔥</span> {item.nutrition?.calories || 0}kcal</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>🥩</span> {item.nutrition?.protein || 0}g</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: '#D4AF37', fontWeight: 'bold'}}>🌾</span> {item.nutrition?.carbs || 0}g</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>🥑</span> {item.nutrition?.fat || 0}g</span>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-dark)', justifyContent: 'space-between', background: 'rgba(255,255,255,0.7)', padding: '10px 16px', borderRadius: '8px' }}>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--terracotta)', fontWeight: 'bold'}}>💊 Vit C:</span> {item.nutrition?.vitC || 0}mg</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--forest-green)', fontWeight: 'bold'}}>💊 Vit E:</span> {item.nutrition?.vitE || 0}mg</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: '#D4AF37', fontWeight: 'bold'}}>💊 Folate:</span> {item.nutrition?.folate || 0}mcg</span>
                                <span style={{whiteSpace: 'nowrap'}}><span style={{color: 'var(--espresso-soft)', fontWeight: 'bold'}}>💊 Vit B6:</span> {item.nutrition?.vitB6 || 0}mg</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
