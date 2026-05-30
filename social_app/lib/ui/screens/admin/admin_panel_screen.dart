import 'package:flutter/material.dart';

class AdminPanelScreen extends StatelessWidget {
  const AdminPanelScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Admin Panel'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Venue Statistics',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildStatCard('Active Users', '42', Icons.people, Colors.blue),
                const SizedBox(width: 16),
                _buildStatCard('Check-ins', '128', Icons.location_on, Colors.green),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildStatCard('Vouchers', '15', Icons.confirmation_number, Colors.orange),
                const SizedBox(width: 16),
                _buildStatCard('Reach', '1.2k', Icons.trending_up, Colors.purple),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Active Promotions',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildPromoTile('Happy Hour 2x1', 'Active until 10:00 PM'),
            _buildPromoTile('Free Shot with Check-in', 'Active all night'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
              child: const Text('Create New Promotion'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 8),
              Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPromoTile(String title, String status) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text(status),
        trailing: Switch(value: true, onChanged: (val) {}),
      ),
    );
  }
}
