class VenueModel {
  final String id;
  final String name;
  final double latitude;
  final double longitude;
  final String description;
  final String promotion;

  VenueModel({
    required this.id,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.description,
    required this.promotion,
  });

  factory VenueModel.fromMap(Map<String, dynamic> data, String id) {
    return VenueModel(
      id: id,
      name: data['name'] ?? '',
      latitude: (data['latitude'] ?? 0.0).toDouble(),
      longitude: (data['longitude'] ?? 0.0).toDouble(),
      description: data['description'] ?? '',
      promotion: data['promotion'] ?? '',
    );
  }
}
