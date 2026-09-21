import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import TrainerDashboard from "../pages/trainer/Dashboard";
import MemberDashboard from "../pages/member/Dashboard";
import Home from "../pages/public/Home";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Members from "../pages/admin/Members";
import Trainers from "../pages/admin/Trainers";
import MembershipPlans from "../pages/admin/MembershipPlans";
import Memberships from "../pages/admin/Membership";
import Attendance from "../pages/admin/Attendence";
import TrainerExercises from "../pages/trainer/Exercise";
import TrainerLayout from "../layouts/TrainerLayout";
import TrainerDietPlans from "../pages/trainer/DietPlans";
import MemberLayout from "../layouts/MemberLayout";
import Membership from "../pages/member/Membership";
import MemberExercises from "../pages/member/Exercise";
import MemberDietPlans from "../pages/member/Dietplans";
import MemberAttendance from "../pages/member/Attendence";
import Services from "../pages/admin/Servives";
import PublicServices from "../pages/public/SeeAllServices";
import MemberReview from "../pages/member/Review";
import JoinRequests from "../pages/admin/JoinRequest";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="membership-plans" element={<MembershipPlans />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="services" element={<Services />} />
          <Route path="join-requests" element={<JoinRequests />} />
        </Route>

        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRole="TRAINER">
              <TrainerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="exercises" element={<TrainerExercises />} />
          <Route path="diet-plans" element={<TrainerDietPlans />} />
        </Route>

        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRole="MEMBER">
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="membership" element={<Membership />} />
          <Route path="exercises" element={<MemberExercises />} />
          <Route path="diet-plans" element={<MemberDietPlans />} />
          <Route path="attendance" element={<MemberAttendance />} />
          <Route path="review" element={<MemberReview />} />
        </Route>
        <Route path="/services" element={<PublicServices />} />
      </Routes>
    </BrowserRouter>
  );
}
