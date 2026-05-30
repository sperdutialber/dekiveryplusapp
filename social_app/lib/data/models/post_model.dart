class PostModel {
  final String id;
  final String userId;
  final String userName;
  final String content;
  final String imageUrl;
  final DateTime timestamp;

  PostModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.content,
    required this.imageUrl,
    required this.timestamp,
  });

  factory PostModel.fromMap(Map<String, dynamic> data, String id) {
    return PostModel(
      id: id,
      userId: data['userId'] ?? '',
      userName: data['userName'] ?? '',
      content: data['content'] ?? '',
      imageUrl: data['imageUrl'] ?? '',
      timestamp: (data['timestamp'] != null)
          ? DateTime.fromMillisecondsSinceEpoch(data['timestamp'])
          : DateTime.now(),
    );
  }
}
