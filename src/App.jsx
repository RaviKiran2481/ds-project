import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Background3D from './components/Background3D'
import Home from './pages/Home'
import Modules from './pages/Modules'
import ModuleDetails from './pages/ModuleDetails'
import Experiments from './pages/Experiments'
import ExperimentOverview from './pages/ExperimentOverview'
import SubExperiment from './pages/SubExperiment'
import Tools from './pages/Tools'
import ToolDetails from './pages/ToolDetails'
import MaterialViewer from './pages/MaterialViewer'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:moduleId" element={<ModuleDetails />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/experiments/:experimentId" element={<ExperimentOverview />} />
          <Route path="/experiments/:experimentId/overview" element={<ExperimentOverview />} />
          <Route path="/experiments/:experimentId/:subExperimentId" element={<SubExperiment />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:toolId" element={<ToolDetails />} />
          <Route path="/materials/:materialId" element={<MaterialViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  )
}
