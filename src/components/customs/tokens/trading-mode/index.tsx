'use client';

import TradingViewWidget from '@/components/shared/chart/trade-view';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import HistoryTable from '../../table/data-table/history';
import HoldersTable from '../../table/data-table/holders';
import OrdersTable from '../../table/data-table/orders';
import PositionsTable from '../../table/data-table/positions';
import TopTradersTable from '../../table/data-table/top-traders';
import TradesTable from '../../table/data-table/trades';
import TradingControls from './trade-converta';
import VideoSection from './video-section';

type TradingModePanelProps = {
  tokenMint: string;
};

function TradingModePanel({ tokenMint }: TradingModePanelProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab') || 'video';

  const tabs = [
    { name: 'Video', tab: 'video' },
    { name: 'Orders', tab: 'orders' },
    { name: 'Holders', tab: 'holders' },
    { name: 'Top Traders', tab: 'top-traders' },
    //{ name: 'Trades', tab: 'trades' },
  ];

  return (
    <section className="w-full flex flex-col flex-1 pt-6 pb-6">
      {/* MAIN ROW */}
      <div className="flex w-full gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="w-full">
            <TradingViewWidget tokenMint={tokenMint} />
          </div>

          <div className="w-full mt-6 flex flex-col gap-2 text-white/50 urbanist min-h-0 overflow-hidden">
            <div className="overflow-x-auto">
              <nav className="flex px-2" aria-label="Settings tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.tab}
                    scroll={false}
                    href={`?tab=${tab.tab}`}
                    className={`whitespace-nowrap px-6 py-1.5 border-b-2 font-medium text-base ${
                      activeTab === tab.tab
                        ? 'text-white border-white'
                        : 'text-gray-300 border-gray-600'
                    } urbanist`}
                  >
                    {tab.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              {activeTab === 'video' && <VideoSection />}
              {activeTab === 'orders' && <OrdersTable tokenMint={tokenMint} />}
              {activeTab === 'trades' && <TradesTable tokenMint={tokenMint} />}
              {activeTab === 'holders' && <HoldersTable tokenMint={tokenMint} />}
              {activeTab === 'positions' && <PositionsTable tokenMint={tokenMint} />}
              {activeTab === 'history' && <HistoryTable tokenMint={tokenMint} />}
              {activeTab === 'top-traders' && <TopTradersTable tokenMint={tokenMint} />}
            </div>
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="hidden xl:block w-px bg-gradient-to-b from-transparent via-white/60 to-transparent" />

        {/* RIGHT SIDE — FIXED WIDTH */}
        <div className="hidden xl:flex flex-col w-[360px] shrink-0 gap-4">
          <div className="w-full">
            <TradingControls tokenMint={tokenMint} />
          </div>

          <Card className="w-full h-[180px] bg-white flex items-center justify-center">
            <CardContent className="flex items-center gap-2 bg-red-600 px-6 py-4 rounded-md">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <h1 className="text-2xl font-semibold text-white urbanist">LIVE</h1>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default TradingModePanel;
