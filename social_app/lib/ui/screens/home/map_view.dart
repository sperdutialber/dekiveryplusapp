import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../../../data/repositories/i_repository.dart';

class MapView extends StatefulWidget {
  const MapView({super.key});

  @override
  State<MapView> createState() => _MapViewState();
}

class _MapViewState extends State<MapView> {
  late GoogleMapController mapController;
  final Set<Marker> _markers = {};

  // Center on New York for mock data
  final LatLng _center = const LatLng(40.7128, -74.0060);

  @override
  void initState() {
    super.initState();
    _loadMarkers();
  }

  Future<void> _loadMarkers() async {
    final repository = Provider.of<IRepository>(context, listen: false);
    final venues = await repository.getVenues();
    final users = await repository.getUsers();

    if (!mounted) return;
    setState(() {
      // Add venue markers
      for (final venue in venues) {
        _markers.add(
          Marker(
            markerId: MarkerId(venue.id),
            position: LatLng(venue.latitude, venue.longitude),
            infoWindow: InfoWindow(
              title: venue.name,
              snippet: venue.promotion,
            ),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueViolet),
          ),
        );
      }

      // Add friend markers (offset slightly from center)
      for (int i = 0; i < users.length; i++) {
        final user = users[i];
        _markers.add(
          Marker(
            markerId: MarkerId(user.id),
            position: LatLng(
              _center.latitude + (i * 0.001),
              _center.longitude + (i * 0.001),
            ),
            infoWindow: InfoWindow(
              title: user.name,
              snippet: 'Last seen nearby',
            ),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueCyan),
          ),
        );
      }
    });
  }

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
    // Set custom map style if in dark mode
    if (Theme.of(context).brightness == Brightness.dark) {
      // Future: Add custom dark mode JSON style here
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Map'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMarkers,
          ),
        ],
      ),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 14.0,
        ),
        myLocationEnabled: true,
        markers: _markers,
        zoomControlsEnabled: false,
        mapToolbarEnabled: false,
      ),
    );
  }
}
