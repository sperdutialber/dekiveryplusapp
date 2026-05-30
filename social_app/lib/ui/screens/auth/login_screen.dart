import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/services/auth_service.dart';
import '../../../routes.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'SocialApp',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF9C27B0),
                ),
              ),
              const SizedBox(height: 48),
              ElevatedButton.icon(
                onPressed: () async {
                  final authService = Provider.of<AuthService>(context, listen: false);
                  try {
                    final user = await authService.signInWithGoogle();
                    if (user != null && context.mounted) {
                      Navigator.pushReplacementNamed(context, AppRoutes.home);
                    } else if (context.mounted) {
                      // For development/demo when Firebase is not configured
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Firebase not configured. Entering demo mode.')),
                      );
                      Navigator.pushReplacementNamed(context, AppRoutes.home);
                    }
                  } catch (e) {
                    if (context.mounted) {
                      Navigator.pushReplacementNamed(context, AppRoutes.home);
                    }
                  }
                },
                icon: const Icon(Icons.login),
                label: const Text('Sign in with Google'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, AppRoutes.home);
                },
                icon: const Icon(Icons.camera_alt),
                label: const Text('Sign in with Instagram'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
