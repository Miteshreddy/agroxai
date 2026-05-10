import React from 'react';
import { Download, FileText } from 'lucide-react';
import T from './T';

const ReportExporter = ({ crop, confidence, season, soilType, weather, explanation, mappedValues }) => {

    const generateReport = () => {
        const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const explanationHTML = explanation
            ? Object.entries(explanation)
                .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
                .map(([key, val]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-weight:600;">${key}</td><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:${val > 0 ? '#16a34a' : '#ef4444'};font-weight:700;">${(val * 100).toFixed(1)}%</td></tr>`)
                .join('')
            : '';

        const npkHTML = mappedValues
            ? `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px;">
                <div style="background:#f8fafc;padding:16px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Nitrogen</div>
                    <div style="font-size:24px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.N || 0)}</div>
                </div>
                <div style="background:#f8fafc;padding:16px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Phosphorus</div>
                    <div style="font-size:24px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.P || 0)}</div>
                </div>
                <div style="background:#f8fafc;padding:16px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Potassium</div>
                    <div style="font-size:24px;font-weight:900;color:#0f172a;margin-top:4px;">${Math.round(mappedValues.K || 0)}</div>
                </div>
                <div style="background:#f8fafc;padding:16px;border-radius:12px;text-align:center;">
                    <div style="font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">pH Level</div>
                    <div style="font-size:24px;font-weight:900;color:#0f172a;margin-top:4px;">${(mappedValues.ph || 0).toFixed(1)}</div>
                </div>
            </div>`
            : '';

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgroXAI Report — ${crop}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; padding: 40px; }
        .container { max-width: 700px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 40px; border-radius: 24px; margin-bottom: 24px; }
        .header h1 { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: #1F7A63; margin-bottom: 8px; }
        .header .crop { font-size: 48px; font-weight: 900; text-transform: capitalize; letter-spacing: -1px; }
        .header .conf { font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 8px; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 28px; margin-bottom: 16px; }
        .card h2 { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #1F7A63; margin-bottom: 16px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stat { background: #f8fafc; padding: 14px; border-radius: 12px; }
        .stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 18px; font-weight: 900; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; }
        .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 11px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AgroXAI Recommendation Report</h1>
            <div class="crop">${crop}</div>
            <div class="conf">AI Confidence: ${(confidence * 100).toFixed(1)}% — Generated on ${date} at ${time}</div>
        </div>

        <div class="card">
            <h2>Environmental Conditions</h2>
            <div class="grid-2">
                <div class="stat">
                    <div class="stat-label">Temperature</div>
                    <div class="stat-value">${weather?.temperature ? Math.round(weather.temperature) + '°C' : 'N/A'}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Humidity</div>
                    <div class="stat-value">${weather?.humidity ? weather.humidity + '%' : 'N/A'}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Rainfall</div>
                    <div class="stat-value">${weather?.rainfall ?? 'N/A'} mm</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Season</div>
                    <div class="stat-value">${season || 'N/A'}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Soil Analysis</h2>
            <div class="stat" style="margin-bottom:12px;">
                <div class="stat-label">Soil Type</div>
                <div class="stat-value">${soilType || 'N/A'}</div>
            </div>
            ${npkHTML}
        </div>

        ${explanationHTML ? `
        <div class="card">
            <h2>AI Feature Impact</h2>
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left;padding:8px 12px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e2e8f0;">Feature</th>
                        <th style="text-align:left;padding:8px 12px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e2e8f0;">Impact</th>
                    </tr>
                </thead>
                <tbody>${explanationHTML}</tbody>
            </table>
        </div>` : ''}

        <div class="footer">
            <p>Powered by <strong>AgroXAI</strong> — AI-driven Precision Farming</p>
            <p style="margin-top:4px;">This report is for informational purposes. Consult local agriculture experts for final decisions.</p>
        </div>
    </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AgroXAI_Report_${crop?.replace(/[^a-zA-Z]/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={generateReport}
            className="flex items-center gap-2 px-5 py-3 bg-brand-surface border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-brand-surface hover:border-brand-primary transition-all duration-300 shadow-sm hover:shadow-premium group"
        >
            <Download size={14} className="group-hover:animate-bounce" />
            <T>Download Report</T>
        </button>
    );
};

export default ReportExporter;
