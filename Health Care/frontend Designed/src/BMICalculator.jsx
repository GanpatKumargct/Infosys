import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const TRAINERS = [
    { name: 'Priya Sharma',  spec: 'Weight Loss & Nutrition',  gradient: 'linear-gradient(135deg,#16a34a,#15803d)', bmiTarget: ['Overweight','Obese']  },
    { name: 'Arjun Mehta',   spec: 'Strength & Muscle Building', gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)', bmiTarget: ['Underweight','Normal'] },
    { name: 'Sneha Patel',   spec: 'Yoga & Flexibility',       gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', bmiTarget: ['Normal','Overweight']  },
    { name: 'Ravi Kumar',    spec: 'Cardio & Endurance',       gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', bmiTarget: ['Overweight','Obese']  },
    { name: 'Ananya Singh',  spec: 'Posture & Rehab',          gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', bmiTarget: ['Underweight','Normal'] },
];

function getBMIInfo(bmi) {
    if (bmi < 18.5) return { category:'Underweight', color:'#2563eb', bg:'#dbeafe', tips:['Increase calorie intake with nutrient-rich foods','Add strength training to build muscle mass','Eat protein-rich foods: eggs, dairy, legumes','Have 5-6 smaller meals throughout the day','Consult a nutritionist for a personalized plan'], goal:'Gain healthy weight & build muscle', emoji:'📉' };
    if (bmi < 25)  return { category:'Normal',       color:'#16a34a', bg:'#dcfce7', tips:['Maintain your current healthy lifestyle','Stay active with 30 mins exercise daily','Keep up balanced nutrition habits','Monitor your BMI every 3–6 months','Stay hydrated — drink 2–3 L water daily'], goal:'Maintain current healthy weight', emoji:'✅' };
    if (bmi < 30)  return { category:'Overweight',   color:'#d97706', bg:'#fef3c7', tips:['Reduce calorie intake by 300–500 kcal/day','Do cardio 4–5 times per week','Avoid processed foods and sugary drinks','Eat more vegetables, fruits, and lean protein','Track meals and stay consistent'], goal:'Lose weight gradually & healthily', emoji:'⚠️' };
    return           { category:'Obese',             color:'#dc2626', bg:'#fee2e2', tips:['Consult a doctor before intense exercise','Start with low-impact activities like walking','Follow a structured meal plan','Track your weight weekly','Work with a certified trainer for safe progress'], goal:'Improve health with medical guidance', emoji:'🚨' };
}

function BMICalculator() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ height:'', weight:'', age:'', gender:'male', unit:'metric' });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const calculate = () => {
        setError('');
        let { height, weight, age, unit } = form;
        height = parseFloat(height);
        weight = parseFloat(weight);
        age    = parseInt(age);

        if (!height || !weight || !age) { setError('Please fill in all fields.'); return; }
        if (age < 5 || age > 120)       { setError('Please enter a valid age (5–120).'); return; }

        let hM  = unit === 'metric' ? height / 100 : height * 0.0254;
        let wKg = unit === 'metric' ? weight       : weight * 0.4536;

        if (hM <= 0 || wKg <= 0) { setError('Please enter valid values.'); return; }

        const bmi = wKg / (hM * hM);
        setResult(Math.round(bmi * 10) / 10);
    };

    const info = result ? getBMIInfo(result) : null;
    const recTrainers = result ? TRAINERS.filter(t => t.bmiTarget.includes(info.category)).slice(0, 3) : [];
    const indicatorPos = result ? Math.min(Math.max(((result - 10) / 30) * 100, 2), 98) : 0;

    return (
        <div className="bmi-page">
            <header className="bmi-header">
                <button className="bmi-back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1 className="bmi-header-brand">⚖️ BMI Calculator</h1>
                <div style={{ width: 80 }} />
            </header>

            <div className="bmi-body">
                {/* Left: Form */}
                <div className="bmi-col-left">
                    <div className="bmi-card">
                        <h3 className="bmi-card-title">Enter Your Details</h3>

                        {/* Unit toggle */}
                        <div className="bmi-unit-toggle">
                            <button className={`bmi-unit-btn${form.unit === 'metric' ? ' active' : ''}`} onClick={() => setForm({...form, unit:'metric'})}>📏 Metric (cm / kg)</button>
                            <button className={`bmi-unit-btn${form.unit === 'imperial' ? ' active' : ''}`} onClick={() => setForm({...form, unit:'imperial'})}>📐 Imperial (in / lb)</button>
                        </div>

                        <div className="bmi-field">
                            <label>Height ({form.unit === 'metric' ? 'cm' : 'inches'})</label>
                            <input type="number" name="height" placeholder={form.unit === 'metric' ? 'e.g. 170' : 'e.g. 67'} value={form.height} onChange={handleChange} min="1" />
                        </div>
                        <div className="bmi-field">
                            <label>Weight ({form.unit === 'metric' ? 'kg' : 'lbs'})</label>
                            <input type="number" name="weight" placeholder={form.unit === 'metric' ? 'e.g. 65' : 'e.g. 143'} value={form.weight} onChange={handleChange} min="1" />
                        </div>
                        <div className="bmi-field-row">
                            <div className="bmi-field">
                                <label>Age (years)</label>
                                <input type="number" name="age" placeholder="e.g. 21" value={form.age} onChange={handleChange} min="5" max="120" />
                            </div>
                            <div className="bmi-field">
                                <label>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="bmi-err">⚠️ {error}</div>}
                        <button className="bmi-calc-btn" onClick={calculate}>⚖️ Calculate My BMI</button>
                    </div>

                    {/* Reference Table */}
                    <div className="bmi-card">
                        <h3 className="bmi-card-title">BMI Categories</h3>
                        <table className="bmi-ref-table">
                            <thead>
                                <tr><th>Category</th><th>BMI Range</th></tr>
                            </thead>
                            <tbody>
                                {[
                                    {label:'Underweight', range:'< 18.5',      color:'#3b82f6'},
                                    {label:'Normal',      range:'18.5 – 24.9', color:'#16a34a'},
                                    {label:'Overweight',  range:'25 – 29.9',   color:'#f59e0b'},
                                    {label:'Obese',       range:'≥ 30',         color:'#ef4444'},
                                ].map(r => (
                                    <tr key={r.label} style={{ fontWeight: result && getBMIInfo(result).category === r.label ? '700' : '400', background: result && getBMIInfo(result).category === r.label ? r.color + '15' : '' }}>
                                        <td><span className="bmi-ref-dot" style={{background:r.color}}/>{r.label}</td>
                                        <td style={{color:'#6b7280',fontWeight:600}}>{r.range}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Result */}
                <div className="bmi-col-right">
                    {!result ? (
                        <div className="bmi-card" style={{textAlign:'center', padding:'60px 24px'}}>
                            <div style={{fontSize:'4rem', marginBottom:14}}>⚖️</div>
                            <div style={{fontSize:'1.1rem', fontWeight:700, color:'#374151', marginBottom:8}}>Your BMI result will appear here</div>
                            <p style={{fontSize:'.88rem', color:'#9ca3af', padding:0}}>Fill in your details and click Calculate.</p>
                        </div>
                    ) : (
                        <>
                            {/* Result card */}
                            <div className="bmi-card">
                                <div className="bmi-result-center">
                                    <div className="bmi-result-num" style={{color: info.color}}>{result}</div>
                                    <div className="bmi-category-pill" style={{background:info.bg, color:info.color}}>
                                        {info.emoji} {info.category}
                                    </div>
                                    <div className="bmi-result-subtitle">🎯 Goal: {info.goal}</div>
                                </div>

                                {/* Scale bar */}
                                <div className="bmi-scale-bar">
                                    <div style={{background:'#3b82f6'}}/>
                                    <div style={{background:'#16a34a'}}/>
                                    <div style={{background:'#f59e0b'}}/>
                                    <div style={{background:'#ef4444'}}/>
                                </div>
                                <div className="bmi-indicator-wrap">
                                    <div className="bmi-indicator-dot" style={{left: indicatorPos + '%'}}/>
                                </div>
                                <div className="bmi-scale-labels">
                                    <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                                </div>

                                {/* Tips */}
                                <div className="bmi-tips-box">
                                    <h4>💡 Personalized Health Tips</h4>
                                    <ul>
                                        {info.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommended trainers */}
                            {recTrainers.length > 0 && (
                                <div className="bmi-card">
                                    <h3 className="bmi-card-title">🏋️ Recommended Trainers for You</h3>
                                    {recTrainers.map(t => {
                                        const initials = t.name.split(' ').map(w=>w[0]).join('');
                                        return (
                                            <div key={t.name} className="bmi-trainer-mini" onClick={() => navigate('/trainers')}>
                                                <div className="bmi-trainer-mini-avatar" style={{background: t.gradient}}>{initials}</div>
                                                <div>
                                                    <div className="bmi-trainer-mini-name">{t.name}</div>
                                                    <div className="bmi-trainer-mini-spec">{t.spec}</div>
                                                </div>
                                                <button className="bmi-trainer-mini-btn">View →</button>
                                            </div>
                                        );
                                    })}
                                    <button onClick={() => navigate('/trainers')} style={{width:'100%', marginTop:8, padding:'9px', border:'1.5px solid #16a34a', borderRadius:8, background:'transparent', color:'#15803d', fontWeight:600, fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit'}}>
                                        See All Trainers →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BMICalculator;
