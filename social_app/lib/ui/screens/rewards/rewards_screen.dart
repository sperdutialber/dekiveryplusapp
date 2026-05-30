import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/repositories/i_repository.dart';
import '../../../data/models/reward_model.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = Provider.of<IRepository>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Rewards'),
      ),
      body: FutureBuilder<List<RewardModel>>(
        future: repository.getRewards(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final rewards = snapshot.data ?? [];
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: rewards.length,
            itemBuilder: (context, index) {
              final reward = rewards[index];
              return Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.confirmation_number,
                        size: 48,
                        color: reward.isRedeemed ? Colors.grey : const Color(0xFF9C27B0),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        reward.title,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          decoration: reward.isRedeemed ? TextDecoration.lineThrough : null,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        reward.description,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 12),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: reward.isRedeemed ? null : () {},
                        child: Text(reward.isRedeemed ? 'Redeemed' : 'Redeem'),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
