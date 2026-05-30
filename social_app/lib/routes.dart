import 'package:flutter/material.dart';
import 'ui/screens/auth/login_screen.dart';
import 'ui/screens/home/home_screen.dart';
import 'ui/screens/rewards/rewards_screen.dart';
import 'ui/screens/profile/profile_screen.dart';
import 'ui/screens/admin/admin_panel_screen.dart';

class AppRoutes {
  static const String login = '/login';
  static const String home = '/home';
  static const String rewards = '/rewards';
  static const String profile = '/profile';
  static const String admin = '/admin';

  static Map<String, WidgetBuilder> getRoutes() {
    return {
      login: (context) => const LoginScreen(),
      home: (context) => const HomeScreen(),
      rewards: (context) => const RewardsScreen(),
      profile: (context) => const ProfileScreen(),
      admin: (context) => const AdminPanelScreen(),
    };
  }
}
