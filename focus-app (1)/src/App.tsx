/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/common/BottomNav';
import { TodayScreen } from './components/today/TodayScreen';
import { RoutineScreen } from './components/routine/RoutineScreen';
import { PlanScreen } from './components/plan/PlanScreen';
import { TasksScreen } from './components/tasks/TasksScreen';
import { HabitsScreen } from './components/habits/HabitsScreen';
import { MonthlyScreen } from './components/monthly/MonthlyScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { TaskModal } from './components/tasks/TaskModal';
import { GoalModal } from './components/plan/GoalModal';
import { HabitEditModal } from './components/habits/HabitEditModal';
import { NightReviewModal } from './components/habits/NightReviewModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { NotificationModal } from './components/profile/NotificationModal';
import { FocusTimerModal } from './components/focus/FocusTimerModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="w-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full"
        >
          {activeTab === 'today' && <TodayScreen />}
          {activeTab === 'routine' && <RoutineScreen />}
          {activeTab === 'plan' && <PlanScreen />}
          {activeTab === 'tasks' && <TasksScreen />}
          {activeTab === 'habits' && <HabitsScreen />}
          {activeTab === 'monthly' && <MonthlyScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#05090D] text-[#F7F9FC] flex flex-col justify-start items-center">
        {/* Mobile viewport frame wrapper */}
        <div className="w-full max-w-[430px] min-h-screen bg-[#05090D] px-4 pt-2 pb-20 relative flex flex-col">
          <MainContent />
          <BottomNav />
        </div>

        {/* Global Modals & Sheets */}
        <TaskModal />
        <GoalModal />
        <HabitEditModal />
        <NightReviewModal />
        <ProfileModal />
        <NotificationModal />
        <FocusTimerModal />
      </div>
    </AppProvider>
  );
}
