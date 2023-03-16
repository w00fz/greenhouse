import { useState } from 'react';
import {
  initialData,
  ProductionRaft,
  GerminationTray,
  VarietyType,
  DataType,
  GAME_SPEED,
  varieties,
} from './utils/data';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

let intervalId: number;

function App() {
  const [timer, setTimer] = useState<boolean>(false);
  const [day, setDay] = useState(initialData.day);
  const [germination, setGermination] = useState<DataType['germination']>(initialData.germination);
  const [production, setProduction] = useState<DataType['production']>(initialData.production);

  /**
   * Can be used for
   */
  const gameLoop = () => {
    cycleProduction();
    resetTimer();
    setDay((day) => day + 1);
  };

  // A bit of a hack to reset the css animation on the timer
  const resetTimer = () => {
    setTimer(false);
    setTimer(true);
  };

  /**
   * Adds a new raft to each pond in production
   */
  const cycleProduction = () => {
    setProduction((production) => {
      const newProduction = [...production];
      newProduction.forEach((pond) => {
        pond.rafts.unshift(new ProductionRaft());
      });

      return newProduction;
    });
  };

  /**
   * Logs the game's data objects to console
   */
  const debug = () => {
    console.log({
      day,
      germination,
      production,
      timer,
    });
  };

  /**
   * Transplants seedlings from the oldest seeded tray to the newest raft of the
   * selected pond.
   * @param {number} pondIndex the index of the pond to transplant to
   */

  const transplantToPond = (pondIndex: number) => {
    const germinationCopy = { ...germination };
    const productionCopy = [...production];

    const sourceTray = germinationCopy.trays.pop();
    const destinationRaft = productionCopy[pondIndex].rafts[0];

    // ADDED: if we have no source tray, we don't need to do anything
    if (!sourceTray || !destinationRaft) return;

    const plantsRequested = destinationRaft.open;
    const plantsAvailable = sourceTray.plants;
    const plantsUsed = Math.min(plantsRequested, plantsAvailable);

    sourceTray.plants -= plantsUsed;
    destinationRaft.plants += plantsUsed;

    if (sourceTray.plants > 0) {
      germinationCopy.trays.push(sourceTray);
    }

    setGermination(germinationCopy);
    setProduction(productionCopy);
  };

  /**
   * Add a new tray to Germination
   * @param {Object} variety the variety of lettuce to seed
   */
  const seedTray = (variety: VarietyType) => {
    const germinationCopy = { ...germination };
    const newTray = new GerminationTray(variety);
    newTray.plants = newTray.capacity;
    germinationCopy.trays.push(newTray);
    setGermination(germinationCopy);
  };

  /**
   * Clears any existing game loops and starts a new one
   */
  const start = () => {
    clearInterval(intervalId);
    intervalId = setInterval(gameLoop, GAME_SPEED);
    setTimer(true);
  };

  /**
   * Resets the game
   */
  const reset = () => {
    clearInterval(intervalId);
    setDay(initialData.day);
    setGermination(initialData.germination);
    setProduction(initialData.production);
    setTimer(false);
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-8 p-10">
      <header className="flex items-center justify-between text-center">
        <h1 className="text-4xl font-bold">Greenhouse</h1>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg bg-emerald-400 px-4 py-2 text-emerald-900 transition hover:bg-emerald-500"
            onClick={start}
          >
            Start
          </button>
          <button
            className="rounded-lg bg-yellow-400 px-4 py-2 text-yellow-900 transition hover:bg-yellow-500"
            onClick={reset}
          >
            Reset
          </button>
          <button
            className="rounded-lg bg-rose-400 px-4 py-2 text-rose-900 transition hover:bg-rose-500"
            onClick={debug}
          >
            Debug
          </button>
        </div>
      </header>
      <AnimatePresence>
        <div className="relative mx-auto overflow-hidden rounded-lg bg-slate-200 py-1 px-3 text-center text-2xl uppercase tracking-wide text-slate-800">
          <span className="relative z-[1]">
            Day <span className="font-bold">{day}</span>
          </span>
          {timer ? (
            <motion.div
              className={classNames({
                'pointer-events-none absolute inset-y-0 left-0 z-0 bg-sky-300': true,
              })}
              animate={{
                width: '100%',
                transition: { duration: GAME_SPEED / 1000, repeat: Infinity },
              }}
            />
          ) : null}
        </div>
      </AnimatePresence>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Germination</h2>
        <button
          className="inline-flex rounded-lg bg-blue-500 px-4 py-2 text-blue-50 transition hover:bg-blue-600"
          onClick={() => seedTray(varieties[0])}
        >
          {varieties[0].name}
        </button>
        <div className="grid max-h-72 grid-cols-4 gap-3 overflow-auto rounded-lg bg-slate-100 p-3">
          {germination.trays.map((tray, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg bg-slate-200 p-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 flex-shrink-0 rounded-full bg-blue-500" />
                <span className="text-sm">{tray.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Production</h2>
          <div className="flex flex-col gap-12 rounded-lg bg-slate-100 p-3">
            {production.map((pond, pondIndex) => (
              <div key={pondIndex}>
                <div className="mb-2 flex items-center justify-between border-b-2 border-slate-300 pb-2">
                  <h3 className="text-xl font-semibold">
                    <span>{pond.name}</span>
                  </h3>
                  <div>
                    <button
                      className="inline-flex rounded-lg bg-blue-500 px-3 py-1 text-blue-50 transition hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
                      onClick={() => transplantToPond(pondIndex)}
                      disabled={!germination.trays.length}
                    >
                      Transplant
                    </button>
                  </div>
                </div>
                <div className="flex max-h-60 flex-wrap gap-2 overflow-auto">
                  {pond.rafts.map((raft, raftIndex) => (
                    <motion.div
                      key={`${pond.name}-${raftIndex}`}
                      className={classNames({
                        'flex h-12 w-12 items-center justify-center rounded-lg border': true,
                        'bg-white': raft.plants === 0,
                        'bg-yellow-600 text-yellow-300': raft.plants > 0,
                      })}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        x: '100%',
                        transition: {
                          duration: GAME_SPEED * 1000,
                          opacity: { duration: 0.35 },
                        },
                      }}
                    >
                      {raft.plants}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
