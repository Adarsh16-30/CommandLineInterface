
import { TUIEngine } from '../utils/tui-engine.js';
import si from 'systeminformation';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default function (program) {
    program
        .command('monitor')
        .description('Real-time system monitoring dashboard')
        .option('-i, --interval <ms>', 'Update interval in milliseconds', '1000')
        .action(async (options) => {
            const tui = new TUIEngine();
            const screen = tui.getScreen();

            const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

            const cpuLine = grid.set(0, 0, 4, 6, contrib.line, {
                style: { line: tui.getTheme().accent, text: tui.getTheme().foreground, baseline: tui.getTheme().border },
                showNthLabel: 5,
                label: ' CPU Usage % ',
                showLegend: true,
                legend: { width: 12 }
            });

            const memLine = grid.set(0, 6, 4, 6, contrib.line, {
                style: { line: tui.getTheme().primary, text: tui.getTheme().foreground, baseline: tui.getTheme().border },
                showNthLabel: 5,
                label: ' Memory Usage % ',
                showLegend: true,
                legend: { width: 12 }
            });

            const netSpark = grid.set(4, 0, 2, 6, contrib.sparkline, {
                label: ' Network I/O (KB/s) ',
                tags: true,
                style: { fg: tui.getTheme().secondary }
            });

            const diskDonut = grid.set(4, 6, 2, 6, contrib.donut, {
                label: ' Disk Usage ',
                radius: 8,
                arcWidth: 3,
                remainColor: tui.getTheme().border,
                yPadding: 2
            });

            const processTable = grid.set(6, 0, 6, 12, contrib.table, {
                keys: true,
                fg: tui.getTheme().foreground,
                selectedFg: tui.getTheme().background,
                selectedBg: tui.getTheme().accent,
                interactive: true,
                label: ' Top Processes (Press q to exit) ',
                width: '100%',
                height: '100%',
                columnSpacing: 3,
                columnWidth: [7, 30, 10, 10, 10]
            });

            const cpuData = { title: 'CPU', x: [], y: [] };
            const memData = { title: 'Memory', x: [], y: [] };
            const netData = [];
            let dataPoints = 60;

            for (let i = 0; i < dataPoints; i++) {
                cpuData.x.push(i.toString());
                cpuData.y.push(0);
                memData.x.push(i.toString());
                memData.y.push(0);
                netData.push(0);
            }

            async function updateData() {
                try {
                    const cpu = await si.currentLoad();
                    const mem = await si.mem();
                    const net = await si.networkStats();
                    const processes = await si.processes();
                    const fsSize = await si.fsSize();

                    cpuData.y.shift();
                    cpuData.y.push(cpu.currentLoad.toFixed(2));
                    memData.y.shift();
                    memData.y.push((mem.used / mem.total * 100).toFixed(2));

                    const netSpeed = net[0] ? (net[0].rx_sec / 1024).toFixed(2) : 0;
                    netData.shift();
                    netData.push(netSpeed);

                    cpuLine.setData([cpuData]);
                    memLine.setData([memData]);
                    netSpark.setData(['Network'], [netData]);

                    if (fsSize.length > 0) {
                        const diskPercent = fsSize[0].use;
                        diskDonut.setData([
                            { percent: diskPercent / 100, label: 'Used', color: tui.getTheme().warning },
                            { percent: (100 - diskPercent) / 100, label: 'Free', color: tui.getTheme().success }
                        ]);
                    }

                    const topProcs = processes.list
                        .sort((a, b) => b.cpu - a.cpu)
                        .slice(0, 15)
                        .map(p => [
                            p.pid.toString(),
                            p.name.substring(0, 28),
                            `${p.cpu.toFixed(1)}%`,
                            `${(p.mem / 1024 / 1024).toFixed(0)}MB`,
                            p.state
                        ]);

                    processTable.setData({
                        headers: ['PID', 'Name', 'CPU', 'Memory', 'State'],
                        data: topProcs
                    });

                    screen.render();
                } catch (err) {
                    console.error('Error updating data:', err.message);
                }
            }

            const interval = setInterval(updateData, parseInt(options.interval));
            updateData();

            screen.key(['q', 'C-c'], () => {
                clearInterval(interval);
                tui.destroy();
            });

            screen.render();
        });
}
