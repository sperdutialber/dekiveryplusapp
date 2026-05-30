import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/repositories/i_repository.dart';
import '../../../data/models/post_model.dart';

class FeedView extends StatelessWidget {
  const FeedView({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = Provider.of<IRepository>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Feed'),
      ),
      body: FutureBuilder<List<PostModel>>(
        future: repository.getPosts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final posts = snapshot.data ?? [];
          return ListView.builder(
            itemCount: posts.length,
            itemBuilder: (context, index) {
              final post = posts[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListTile(
                      leading: CircleAvatar(
                        backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=${post.userId}'),
                      ),
                      title: Text(post.userName),
                      subtitle: Text(_getTimeAgo(post.timestamp)),
                      trailing: const Icon(Icons.more_horiz),
                    ),
                    if (post.imageUrl.isNotEmpty)
                      Image.network(
                        post.imageUrl,
                        height: 250,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        post.content,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.favorite_border, size: 20),
                          const SizedBox(width: 4),
                          const Text('24'),
                          const SizedBox(width: 16),
                          const Icon(Icons.chat_bubble_outline, size: 20),
                          const SizedBox(width: 4),
                          const Text('5'),
                          const Spacer(),
                          const Icon(Icons.share_outlined, size: 20),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _getTimeAgo(DateTime timestamp) {
    final difference = DateTime.now().difference(timestamp);
    if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
    if (difference.inHours < 24) return '${difference.inHours}h ago';
    return '${difference.inDays}d ago';
  }
}
