
import { useMemo, useState } from "react";
import {
  Activity, Zap, IndianRupee, Leaf, Plus, Trash2,
  Fan, Lightbulb, Snowflake, Monitor, Refrigerator,
  TrendingDown, LayoutDashboard, Settings, Menu, X,
  Clock, AlertTriangle
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import "./App.css";

const initialAppliances = [
  { id: 1, name: "Air Conditioner", watts: 1500, quantity: 1, hours: 6, icon: "ac" },
  { id: 2, name: "Ceiling Fan", watts: 75, quantity: 3, hours: 8, icon: "fan" },
  { id: 3, name: "LED Bulb", watts: 12, quantity: 6, hours: 6, icon: "light" },
  { id: 4, name: "Refrigerator", watts: 200, quantity: 1, hours: 10, icon: "fridge" },
  { id: 5, name: "Computer", watts: 150, quantity: 2, hours: 5, icon: "monitor" },
];

const iconMap = {
  ac: Snowflake,
  fan: Fan,
  light: Lightbulb,
  fridge: Refrigerator,
  monitor: Monitor,
};

const format = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

export default function App() {
  const [appliances, setAppliances] = useState(initialAppliances);
  const [tariff, setTariff] = useState(6);
  const [reduction, setReduction] = useState(20);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({
    name: "", watts: "", quantity: 1, hours: 4, icon: "monitor"
  });

  const totals = useMemo(() => {
    const daily = appliances.reduce(
      (sum, a) => sum + (a.watts * a.quantity * a.hours) / 1000, 0
    );
    const monthly = daily * 30;
    return {
      daily,
      monthly,
      cost: monthly * tariff,
      saved: monthly * reduction / 100,
      savedCost: monthly * tariff * reduction / 100,
    };
  }, [appliances, tariff, reduction]);

  const chartData = useMemo(() =>
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
      day,
      usage: Number((totals.daily * [0.85, 0.92, 1.05, 0.96, 1.12, 1.2, 0.9][i]).toFixed(2)),
      target: Number((totals.daily * (1 - reduction / 100)).toFixed(2)),
    })),
  [totals.daily, reduction]);

  const categoryData = appliances.map((a) => ({
    name: a.name,
    value: a.watts * a.quantity * a.hours / 1000,
  }));

  function addAppliance(e) {
    e.preventDefault();
    if (!form.name.trim() || Number(form.watts) <= 0) return;
    setAppliances((old) => [...old, {
      ...form,
      id: Date.now(),
      watts: Number(form.watts),
      quantity: Math.max(1, Number(form.quantity)),
      hours: Math.min(24, Math.max(0, Number(form.hours))),
    }]);
    setForm({ name: "", watts: "", quantity: 1, hours: 4, icon: "monitor" });
    setShowForm(false);
  }

  function removeAppliance(id) {
    setAppliances((old) => old.filter((a) => a.id !== id));
  }

  const recommendations = [
    {
      title: "Optimize air conditioning",
      text: "Try increasing the AC temperature slightly and reduce unnecessary operating hours.",
      saving: "High impact",
      icon: Snowflake,
      show: appliances.some((a) => a.icon === "ac" || /air conditioner|ac\b/i.test(a.name)),
    },
    {
      title: "Switch off idle devices",
      text: "Turn off computers, monitors and other devices when they are not in use.",
      saving: "Medium impact",
      icon: Monitor,
      show: true,
    },
    {
      title: "Use efficient lighting",
      text: "Choose LED lighting and switch off lights in unoccupied rooms.",
      saving: "Low-cost action",
      icon: Lightbulb,
      show: true,
    },
  ].filter((r) => r.show);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Zap size={23} fill="currentColor" /></div>
          <div><h2>WattWise</h2><span>ENERGY INTELLIGENCE</span></div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X /></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav>
          <a className="nav-item active" href="#dashboard" onClick={() => setMobileMenu(false)}>
            <LayoutDashboard size={19} /> Dashboard
          </a>
          <a className="nav-item" href="#appliances" onClick={() => setMobileMenu(false)}>
            <Zap size={19} /> Appliances
          </a>
          <a className="nav-item" href="#insights" onClick={() => setMobileMenu(false)}>
            <Leaf size={19} /> Energy insights
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="eco-card">
            <Leaf size={23} />
            <h3>Small changes.<br />Big impact.</h3>
            <p>Understand your usage and build smarter energy habits.</p>
          </div>
          <div className="profile">
            <div className="avatar">WW</div>
            <div><strong>WattWise User</strong><span>Energy manager</span></div>
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close menu" />}

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div>
          <div className="topbar-right"><span className="live-dot" /> Energy overview <div className="top-avatar">W</div></div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow"><Activity size={15} /> YOUR ENERGY, SIMPLIFIED</div>
            <h1>Energy Dashboard</h1>
            <p>Monitor consumption, estimate costs and discover opportunities to save.</p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Add appliance</button>
        </section>

        <section className="stat-grid">
          <article className="stat-card">
            <div className="stat-top"><span>Daily consumption</span><div className="stat-icon blue"><Zap /></div></div>
            <div className="stat-number">{format(totals.daily)} <small>kWh</small></div>
            <div className="stat-foot"><span className="neutral-pill"><Activity size={13} /> Estimated</span><span>per day</span></div>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>Monthly consumption</span><div className="stat-icon purple"><Activity /></div></div>
            <div className="stat-number">{format(totals.monthly)} <small>kWh</small></div>
            <div className="stat-foot"><span>30-day projection</span></div>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>Estimated monthly bill</span><div className="stat-icon orange"><IndianRupee /></div></div>
            <div className="stat-number">₹{format(totals.cost)}</div>
            <div className="stat-foot"><span>At ₹{format(tariff)}/kWh</span><a href="#settings">Edit tariff ↓</a></div>
          </article>
          <article className="stat-card savings-card">
            <div className="stat-top"><span>Potential monthly savings</span><div className="stat-icon green"><TrendingDown /></div></div>
            <div className="stat-number">₹{format(totals.savedCost)}</div>
            <div className="stat-foot"><span className="positive-pill"><Leaf size={13} /> {reduction}% reduction</span></div>
          </article>
        </section>

        <section className="chart-grid">
          <article className="panel usage-panel">
            <div className="panel-heading">
              <div><h2>Consumption overview</h2><p>Illustrative daily usage and savings target</p></div>
              <span className="chart-badge"><span /> kWh / day</span>
            </div>
            <div className="chart-legend"><span><i className="legend-blue" /> Estimated usage</span><span><i className="legend-green" /> Savings target</span></div>
            <div className="bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={5}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edf3" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8994a5", fontSize: 12 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8994a5", fontSize: 12 }} width={38} />
                  <Tooltip formatter={(v) => [`${v} kWh`, ""]} />
                  <Bar dataKey="usage" name="Estimated usage" fill="#4778ee" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="target" name="Savings target" fill="#39bd91" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel breakdown-panel">
            <div className="panel-heading"><div><h2>Appliance breakdown</h2><p>Daily energy by appliance</p></div></div>
            {categoryData.length ? <>
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={61} outerRadius={87} paddingAngle={3}>
                      {categoryData.map((entry, index) => <Cell key={entry.name + index} fill={["#4778ee", "#39bd91", "#f5aa46", "#a18aee", "#ec7799", "#5bc4d8"][index % 6]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${format(v)} kWh/day`, "Consumption"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center"><strong>{format(totals.daily)}</strong><span>kWh / day</span></div>
              </div>
              <div className="breakdown-list">
                {categoryData.slice(0, 4).map((item, i) => <div className="breakdown-item" key={item.name}><span className="breakdown-dot" style={{ background: ["#4778ee", "#39bd91", "#f5aa46", "#a18aee"][i % 4] }} /><span className="breakdown-name">{item.name}</span><strong>{format(item.value)} kWh</strong></div>)}
              </div>
            </> : <p className="empty-message">Add an appliance to see your energy breakdown.</p>}
          </article>
        </section>

        <section className="lower-grid">
          <article className="panel appliances-panel" id="appliances">
            <div className="panel-heading">
              <div><h2>Your appliances</h2><p>Manage your devices and daily usage</p></div>
              <button className="text-button" onClick={() => setShowForm(true)}><Plus size={16} /> Add new</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>APPLIANCE</th><th>POWER</th><th>QUANTITY</th><th>HOURS / DAY</th><th>DAILY kWh</th><th /></tr></thead>
                <tbody>
                  {appliances.map((a) => {
                    const Icon = iconMap[a.icon] || Monitor;
                    return <tr key={a.id}>
                      <td><div className="appliance-name"><div className="device-icon"><Icon size={19} /></div><strong>{a.name}</strong></div></td>
                      <td>{format(a.watts)} W</td><td>{a.quantity}</td><td>{a.hours} hrs</td>
                      <td><strong>{format(a.watts * a.quantity * a.hours / 1000)}</strong></td>
                      <td><button className="delete-button" title={`Remove ${a.name}`} onClick={() => removeAppliance(a.id)}><Trash2 size={16} /></button></td>
                    </tr>;
                  })}
                </tbody>
              </table>
              {!appliances.length && <p className="empty-message">No appliances yet. Add one to begin.</p>}
            </div>
          </article>

          <article className="panel settings-panel" id="settings">
            <div className="panel-heading"><div><h2>Scenario planner</h2><p>Explore your savings potential</p></div><Settings size={20} className="muted-icon" /></div>
            <label className="field-label">Electricity tariff <span>₹ / kWh</span></label>
            <div className="tariff-input"><IndianRupee size={17} /><input type="number" min="0" step="0.5" value={tariff} onChange={(e) => setTariff(Math.max(0, Number(e.target.value)))} /></div>
            <div className="setting-divider" />
            <div className="slider-heading"><label className="field-label">Reduce daily usage</label><strong>{reduction}%</strong></div>
            <input className="range-slider" type="range" min="0" max="60" step="5" value={reduction} onChange={(e) => setReduction(Number(e.target.value))} />
            <div className="range-labels"><span>0%</span><span>30%</span><span>60%</span></div>
            <div className="scenario-result">
              <div><Leaf size={20} /><span>Projected monthly savings</span></div>
              <strong>₹{format(totals.savedCost)}</strong>
              <p>About {format(totals.saved)} kWh less electricity over 30 days if you achieve this reduction.</p>
            </div>
          </article>
        </section>

        <section className="panel insights-panel" id="insights">
          <div className="panel-heading"><div><h2>Energy-saving recommendations</h2><p>Practical steps to reduce your estimated consumption</p></div><span className="insight-count">{recommendations.length} suggestions</span></div>
          <div className="recommendation-grid">
            {recommendations.map((r) => {
              const Icon = r.icon;
              return <article className="recommendation" key={r.title}>
                <div className="recommendation-icon"><Icon size={21} /></div>
                <div className="recommendation-content"><span className="impact-tag">{r.saving}</span><h3>{r.title}</h3><p>{r.text}</p></div>
              </article>;
            })}
          </div>
          <div className="note-banner"><AlertTriangle size={18} /><span>These figures are estimates based on the appliance details you enter, not readings from a physical electricity meter.</span></div>
        </section>

        <footer className="footer"><span>© 2026 WattWise · Energy Waste Detective</span><span><span className="footer-dot" /> Estimation mode</span></footer>
      </main>

      {showForm && <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <form className="appliance-modal" onSubmit={addAppliance}>
          <div className="modal-heading"><div><h2>Add an appliance</h2><p>Enter the device's power and daily usage.</p></div><button type="button" className="modal-close" onClick={() => setShowForm(false)}><X /></button></div>
          <label>Appliance name<input required maxLength="60" placeholder="e.g. Washing machine" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Power rating (watts)<input required type="number" min="1" max="100000" placeholder="e.g. 500" value={form.watts} onChange={(e) => setForm({ ...form, watts: e.target.value })} /></label>
          <div className="form-row">
            <label>Quantity<input required type="number" min="1" max="1000" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
            <label>Hours per day<input required type="number" min="0" max="24" step="0.5" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></label>
          </div>
          <label>Device icon<select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}><option value="monitor">Computer / Other</option><option value="ac">Air conditioner</option><option value="fan">Fan</option><option value="light">Light</option><option value="fridge">Refrigerator</option></select></label>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={17} /> Add appliance</button></div>
        </form>
      </div>}
    </div>
  );
}
