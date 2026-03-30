import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'];

const FOOD_SUGGESTIONS = [
    { name: 'Oatmeal',        cal: 150, protein: 5,  carbs: 27, fat: 3,  icon: '🥣' },
    { name: 'Banana',         cal: 90,  protein: 1,  carbs: 23, fat: 0,  icon: '🍌' },
    { name: 'Grilled Chicken',cal: 220, protein: 42, carbs: 0,  fat: 5,  icon: '🍗' },
    { name: 'Brown Rice',     cal: 215, protein: 5,  carbs: 45, fat: 2,  icon: '🍚' },
    { name: 'Eggs (2)',       cal: 140, protein: 12, carbs: 1,  fat: 10, icon: '🥚' },
    { name: 'Greek Yogurt',   cal: 100, protein: 17, carbs: 6,  fat: 1,  icon: '🫙' },
    { name: 'Salad',          cal: 80,  protein: 2,  carbs: 10, fat: 4,  icon: '🥗' },
    { name: 'Almonds (30g)',  cal: 173, protein: 6,  carbs: 6,  fat: 15, icon: '🌰' },
    { name: 'Dal & Rice',     cal: 320, protein: 12, carbs: 58, fat: 4,  icon: '🍛' },
    { name: 'Idli (3)',       cal: 150, protein: 5,  carbs: 30, fat: 1,  icon: '🫓' },
    { name: 'Chapati (2)',    cal: 180, protein: 5,  carbs: 36, fat: 2,  icon: '🫓' },
    { name: 'Paneer',         cal: 265, protein: 18, carbs: 4,  fat: 20, icon: '🧀' },
];

function DietPage() {
    const navigate = useNavigate();
    const [mealType, setMealType] = useState('Breakfast');
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [log, setLog] = useState([
        { id:1, meal:'Breakfast', food:'Oatmeal', cal:150, protein:5, carbs:27, fat:3, time:'08:00 AM', icon:'🥣' },
        { id:2, meal:'Lunch',     food:'Dal & Rice', cal:320, protein:12, carbs:58, fat:4, time:'01:00 PM', icon:'🍛' },
    ]);
    const [goalCal] = useState(2000);

    const totalCal     = log.reduce((s,e) => s + e.cal, 0);
    const totalProtein = log.reduce((s,e) => s + e.protein, 0);
    const totalCarbs   = log.reduce((s,e) => s + e.carbs, 0);
    const totalFat     = log.reduce((s,e) => s + e.fat, 0);
    const calPct = Math.min(100, Math.round((totalCal / goalCal) * 100));

    const quickAdd = (food) => {
        setFoodName(food.name);
        setCalories(food.cal);
        setProtein(food.protein);
        setCarbs(food.carbs);
        setFat(food.fat);
    };

    const handleLog = () => {
        if (!foodName || !calories) return;
        const now = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
        const suggestion = FOOD_SUGGESTIONS.find(f => f.name === foodName);
        setLog([{ id: Date.now(), meal: mealType, food: foodName, cal: Number(calories),
            protein: Number(protein)||0, carbs: Number(carbs)||0, fat: Number(fat)||0,
            time: now, icon: suggestion?.icon || '🍽️' }, ...log]);
        setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
    };

    const handleRemove = (id) => setLog(log.filter(e => e.id !== id));

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>🥗 Diet Tracker</h1>
            </header>

            {/* Macro summary bar */}
            <div style={s.macroBar}>
                <div style={s.macroItem}>
                    <span style={s.macroVal}>{totalCal}</span>
                    <span style={s.macroLabel}>/ {goalCal} kcal</span>
                    <span style={s.macroName}>Calories</span>
                </div>
                <div style={s.macroDivider}/>
                <div style={s.macroItem}>
                    <span style={{...s.macroVal, color:'#f97316'}}>{totalProtein}g</span>
                    <span style={s.macroName}>Protein</span>
                </div>
                <div style={s.macroDivider}/>
                <div style={s.macroItem}>
                    <span style={{...s.macroVal, color:'#facc15'}}>{totalCarbs}g</span>
                    <span style={s.macroName}>Carbs</span>
                </div>
                <div style={s.macroDivider}/>
                <div style={s.macroItem}>
                    <span style={{...s.macroVal, color:'#fb7185'}}>{totalFat}g</span>
                    <span style={s.macroName}>Fat</span>
                </div>
            </div>

            <div style={s.body}>
                {/* Left column */}
                <div style={s.left}>
                    {/* Progress */}
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Daily Calorie Goal</h3>
                        <p style={s.sub}>Consumed: {totalCal} kcal  |  Goal: {goalCal} kcal</p>
                        <div style={s.bar}><div style={{ ...s.fill, width: calPct + '%' }} /></div>
                        <p style={s.pct}>{calPct}% of daily goal</p>
                    </div>

                    {/* Quick Add */}
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>⚡ Quick Add</h3>
                        <div style={s.quickGrid}>
                            {FOOD_SUGGESTIONS.map(food => (
                                <button key={food.name} onClick={() => quickAdd(food)} style={s.quickBtn}>
                                    <span style={s.quickIcon}>{food.icon}</span>
                                    <span style={s.quickName}>{food.name}</span>
                                    <span style={s.quickCal}>{food.cal} kcal</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Log Meal Form */}
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Meal</h3>
                        <label style={s.label}>Meal Type</label>
                        <select value={mealType} onChange={e => setMealType(e.target.value)} style={s.input}>
                            {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
                        </select>
                        <label style={s.label}>Food Name</label>
                        <input value={foodName} onChange={e => setFoodName(e.target.value)} style={s.input} placeholder="e.g. Grilled Chicken" />
                        <label style={s.label}>Calories (kcal)</label>
                        <input type="number" value={calories} onChange={e => setCalories(e.target.value)} style={s.input} placeholder="e.g. 220" min="0" />
                        <div style={s.macroRow}>
                            <div style={{flex:1}}>
                                <label style={s.label}>Protein (g)</label>
                                <input type="number" value={protein} onChange={e => setProtein(e.target.value)} style={s.input} placeholder="0" min="0" />
                            </div>
                            <div style={{flex:1}}>
                                <label style={s.label}>Carbs (g)</label>
                                <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} style={s.input} placeholder="0" min="0" />
                            </div>
                            <div style={{flex:1}}>
                                <label style={s.label}>Fat (g)</label>
                                <input type="number" value={fat} onChange={e => setFat(e.target.value)} style={s.input} placeholder="0" min="0" />
                            </div>
                        </div>
                        <button onClick={handleLog} style={s.btn}>Log Meal</button>
                    </div>
                </div>

                {/* Right column */}
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>📋 Today's Meals</h3>
                        {log.length === 0 && <p style={s.sub}>No meals logged yet.</p>}
                        {['Breakfast','Lunch','Dinner','Snack','Pre-Workout','Post-Workout'].map(meal => {
                            const entries = log.filter(e => e.meal === meal);
                            if (entries.length === 0) return null;
                            return (
                                <div key={meal} style={s.mealGroup}>
                                    <div style={s.mealGroupLabel}>{meal}</div>
                                    {entries.map(e => (
                                        <div key={e.id} style={s.row}>
                                            <span style={s.rowIcon}>{e.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={s.rowTitle}>{e.food}</p>
                                                <p style={s.rowSub}>{e.cal} kcal • P:{e.protein}g • C:{e.carbs}g • F:{e.fat}g</p>
                                            </div>
                                            <span style={s.rowTime}>{e.time}</span>
                                            <button onClick={() => handleRemove(e.id)} style={s.deleteBtn} title="Remove">❌</button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* Tip card */}
                    <div style={s.tipCard}>
                        <h3 style={{...s.cardTitle, color:'#fbbf24'}}>💡 Daily Tip</h3>
                        <p style={{...s.sub, lineHeight:'1.7'}}>Aim for 0.8–1g of protein per kg of body weight. Include colorful vegetables in every meal for essential micronutrients. Stay hydrated — drink water before each meal!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(160deg, #1a0f00 0%, #2d1a00 40%, #1a1000 100%)', fontFamily: "'Segoe UI',sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: 'rgba(20,10,0,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(251,191,36,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' },
    brand: { color: '#fbbf24', fontSize: '20px', fontWeight: '700', margin: 0, textShadow: '0 0 20px rgba(251,191,36,0.5)' },
    back: { background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px', padding: '8px 16px', color: '#fcd34d', cursor: 'pointer', fontWeight: '600' },
    macroBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(20,10,0,0.85)', borderBottom: '1px solid rgba(251,191,36,0.12)', padding: '14px 32px', flexWrap: 'wrap' },
    macroItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' },
    macroDivider: { width: '1px', height: '36px', background: 'rgba(251,191,36,0.15)' },
    macroVal: { fontSize: '22px', fontWeight: '800', color: '#fbbf24', lineHeight: '1' },
    macroLabel: { fontSize: '11px', color: 'rgba(253,230,138,0.5)', marginTop: '2px' },
    macroName: { fontSize: '10px', color: 'rgba(253,230,138,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2px' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1.2, minWidth: '300px' },
    right: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { background: 'rgba(20,10,0,0.80)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(251,191,36,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,191,36,0.08)' },
    tipCard: { background: 'rgba(30,15,0,0.80)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(251,191,36,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backgroundImage: 'radial-gradient(ellipse at top right, rgba(251,191,36,0.06) 0%, transparent 70%)' },
    cardTitle: { color: '#fbbf24', fontWeight: '700', fontSize: '16px', margin: '0 0 12px', textShadow: '0 0 12px rgba(251,191,36,0.4)' },
    sub: { color: 'rgba(253,230,138,0.6)', fontSize: '13px', margin: '0 0 10px' },
    bar: { background: 'rgba(251,191,36,0.10)', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px', border: '1px solid rgba(251,191,36,0.15)' },
    fill: { background: 'linear-gradient(90deg,#b45309,#f59e0b,#fcd34d)', height: '100%', borderRadius: '8px', transition: 'width 0.4s', boxShadow: '0 0 12px rgba(251,191,36,0.4)' },
    pct: { fontWeight: '700', fontSize: '15px', margin: 0, color: '#fcd34d' },
    label: { display: 'block', fontSize: '13px', color: 'rgba(253,230,138,0.7)', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid rgba(251,191,36,0.25)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: 'rgba(251,191,36,0.06)', color: '#fef3c7' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#92400e,#f59e0b)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(251,191,36,0.3)' },
    macroRow: { display: 'flex', gap: '12px' },
    quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', marginTop: '4px' },
    quickBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 8px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', gap: '3px' },
    quickIcon: { fontSize: '20px' },
    quickName: { fontSize: '11px', color: '#fef3c7', fontWeight: '600', textAlign: 'center', lineHeight: '1.2' },
    quickCal: { fontSize: '10px', color: 'rgba(253,230,138,0.5)' },
    mealGroup: { marginBottom: '16px' },
    mealGroupLabel: { fontSize: '11px', fontWeight: '700', color: 'rgba(251,191,36,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '1px solid rgba(251,191,36,0.10)' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(251,191,36,0.06)' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#fef3c7' },
    rowSub: { margin: 0, fontSize: '11px', color: 'rgba(253,230,138,0.5)' },
    rowTime: { marginLeft: 'auto', fontSize: '11px', color: 'rgba(253,230,138,0.35)', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};

export default DietPage;
