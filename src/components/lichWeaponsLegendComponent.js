import React from "react";
import { useTheme } from "../lib/themeProvider.js";
import clsx from "clsx";

const LichWeaponsLegendComponent = () => {
    const {theme} = useTheme();
    
    const getLegendStyles = () => clsx(
        'flex flex-col items-center p-3 m-1 rounded-lg shadow-md flex-1 max-w-sm min-w-32 border-4 cursor-default',
        {
          'bg-void-card text-void-text border-void-border': theme === 'void',
          'bg-corpus-card text-corpus-text border-corpus-border': theme === 'corpus',
          'bg-grineer-card text-grineer-text border-grineer-border': theme === 'grineer',
          'bg-orokin-card text-orokin-text border-orokin-border': theme === 'orokin',
          'bg-dark-card text-dark-text border-dark-border': theme === 'dark',
          'bg-classic-card text-classic-text border-classic-border': theme === 'classic',
        }
      );

    const getTableStyles = () => clsx(
        'table-auto border-2 border-collapse border rounded-lg cursor-default text-center',
        {
          'bg-void-hover text-void-bg border-void-border': theme === 'void',
          'bg-corpus-hover text-corpus-bg border-corpus-border': theme === 'corpus',
          'bg-grineer-hover text-grineer-bg border-grineer-border': theme === 'grineer',
          'bg-orokin-hover text-orokin-bg border-orokin-border': theme === 'orokin',
          'bg-dark-hover text-dark-bg border-dark-border': theme === 'dark',
          'bg-classic-hover text-classic-bg border-classic-border': theme === 'classic',
        }
    );

    const getTableHeaderStyles = () => clsx(
        'border-b-2',
        {
          'border-void-border': theme === 'void',
          'border-corpus-border': theme === 'corpus',
          'border-grineer-border': theme === 'grineer',
          'border-orokin-border': theme === 'orokin',
          'border-dark-border': theme === 'dark',
          'border-classic-border': theme === 'classic',
        }
    );

    const getTableCellStyles = () => clsx(
        'border-r-2',
        {
          'border-void-border': theme === 'void',
          'border-corpus-border': theme === 'corpus',
          'border-grineer-border': theme === 'grineer',
          'border-orokin-border': theme === 'orokin',
          'border-dark-border': theme === 'dark',
          'border-classic-border': theme === 'classic',
        }
    );

    return(
        <div className={getLegendStyles()}>
            <h2>Number of Fusions for Max Bonus</h2>
            <table className={getTableStyles()}>
                <thead>
                    <tr>
                        <th className={getTableHeaderStyles()}>Percentage Range</th>
                        <th className={getTableHeaderStyles()}>Fusions Remaining</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={getTableCellStyles()}>58.0% - 60.0%</td>
                        <td className={getTableCellStyles()}>0</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>52.8% - 57.9%</td>
                        <td className={getTableCellStyles()}>1</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>48.0% - 52.7%</td>
                        <td className={getTableCellStyles()}>2</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>43.6% - 47.9%</td>
                        <td className={getTableCellStyles()}>3</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>39.7% - 43.5%</td>
                        <td className={getTableCellStyles()}>4</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>36.1% - 39.6%</td>
                        <td className={getTableCellStyles()}>5</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>32.8% - 36.0%</td>
                        <td className={getTableCellStyles()}>6</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>29.8% - 32.7%</td>
                        <td className={getTableCellStyles()}>7</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>27.1% - 29.7%</td>
                        <td className={getTableCellStyles()}>8</td>
                    </tr>

                    <tr>
                        <td className={getTableCellStyles()}>25.0% - 27.0%</td>
                        <td className={getTableCellStyles()}>9</td>
                    </tr>
                    <tr>
                        <td className={getTableCellStyles()}>0.0% - 24.9%</td>
                        <td className={getTableCellStyles()}>10 (Don't Own Weapon)</td>
                    </tr>
                </tbody>
            </table>
        </div>

    );
}

export default LichWeaponsLegendComponent;