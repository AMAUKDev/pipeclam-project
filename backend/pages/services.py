import time
import struct
import requests
import base64

from django.db import models

from client.models import Client, Tag

class FindUserTags:
  def __init__(self, client: Client):
    self.client = client

  def get_tags(self):
    tag_ids = Client.objects.filter(id=self.client.id).values_list('tags__id', flat=True)
    tags = [t_names for t_names in Tag.objects.filter(id__in=tag_ids).values_list('name', flat=True)]
    return tags
    
class AstroCast:
  def __init__(self):
    pass

  def get_pipeclam_payload(self, device_guid):
    start_time = time.time()
    res = requests.get(f"https://api.astrocast.com/v1/messages?deviceGuid={device_guid}&startReceivedDate=2023-10-04T10:09:32",
                        headers={"X-Api-Key": "8spq7N5W4aFJv1ZcTird2AubPbcNcfBjQuSOvXUWOhSlUdKwnSbttmtxskeDgZuOe8r8GMWcbS2V521FoH4D1mqNCBffFTfx"}).json()

    end_time = time.time()
    print('AC', end_time - start_time)

    nMessages = len(res)
    message_dicts = []
    
    start_time2 = time.time()
    if nMessages > 0:
      for message in res:
        message_dict = {}
        # deviceGuid = str(message['deviceGuid'])
        # messageGuid = str(message['messageGuid'])
    
        # Payload decoding
        payload = base64.b64decode(message['data']).hex()
        hex_bytes = bytes.fromhex(payload)
        # Determine the size of the bytes object in bytes
        size_in_bytes = len(hex_bytes)
        message_dict['general'] = {}
        message_dict['15_min'] = {}
        message_dict['30_min'] = {}

        ##### General Info #####
        battery_voltage = (struct.unpack('B', bytes.fromhex(payload[0:2]))[0])/10
        solar_panel_voltage = (struct.unpack('B', bytes.fromhex(payload[2:4]))[0])/10
        battery_temp = struct.unpack('B', bytes.fromhex(payload[4:6]))[0]
        message_dict['general']['battery_voltage'] = battery_voltage
        message_dict['general']['solar_panel_voltage'] = battery_voltage
        message_dict['general']['battery_temp'] = battery_temp
        # Assume we have a long message
        message_dict['general']['message_type'] = 'pipeclam_long'

        ##### 15 Minute #####
        gps_time = struct.unpack('I', bytes.fromhex(payload[6:14]))[0] # Unix time
        gps_lat = struct.unpack('f', bytes.fromhex(payload[14:22]))[0]
        gps_lng = struct.unpack('f', bytes.fromhex(payload[22:30]))[0]
        gps_sog = (struct.unpack('B', bytes.fromhex(payload[30:32]))[0])/10 #km/h
        gps_heading = struct.unpack('H', bytes.fromhex(payload[32:36]))[0]

        message_dict['15_min']['gps_time'] = gps_time
        message_dict['15_min']['gps_lat'] = gps_lat
        message_dict['15_min']['gps_lng'] = gps_lng
        message_dict['15_min']['sog'] = gps_sog
        message_dict['15_min']['gps_heading'] = gps_heading
        
        # Long message
        if size_in_bytes == 43:
          max_acceleration = struct.unpack('<h', bytes.fromhex(payload[36:40]))[0]
          max_roll = struct.unpack('<h', bytes.fromhex(payload[40:44]))[0]
          swh = (struct.unpack('B', bytes.fromhex(payload[44:46]))[0])/10

          message_dict['15_min']['max_acceleration'] = max_acceleration
          message_dict['15_min']['max_roll'] = max_roll
          message_dict['15_min']['swh'] = swh

          ##### 30 Minute #####
          gps_time = struct.unpack('I', bytes.fromhex(payload[46:54]))[0] # Unix time
          gps_lat = struct.unpack('f', bytes.fromhex(payload[54:62]))[0]
          gps_lng = struct.unpack('f', bytes.fromhex(payload[62:70]))[0]
          gps_sog = struct.unpack('B', bytes.fromhex(payload[70:72]))[0]
          gps_heading = struct.unpack('H', bytes.fromhex(payload[72:76]))[0]
      
          message_dict['30_min']['gps_time'] = gps_time
          message_dict['30_min']['gps_lat'] = gps_lat
          message_dict['30_min']['gps_lng'] = gps_lng
          message_dict['30_min']['sog'] = gps_sog
          message_dict['30_min']['gps_heading'] = gps_heading

          max_acceleration = struct.unpack('<h', bytes.fromhex(payload[76:80]))[0]
          max_roll = struct.unpack('<h', bytes.fromhex(payload[80:84]))[0]
          swh = (struct.unpack('B', bytes.fromhex(payload[84:86]))[0])/10
          message_dict['30_min']['max_acceleration'] = max_acceleration
          message_dict['30_min']['max_roll'] = max_roll
          message_dict['30_min']['swh'] = swh

        # Short message
        else:
          message_dict['general']['message_type'] = 'pipeclam_short'

          ##### 30 Minute #####
          gps_time = struct.unpack('I', bytes.fromhex(payload[36:44]))[0] # Unix time
          gps_lat = struct.unpack('f', bytes.fromhex(payload[44:52]))[0]
          gps_lng = struct.unpack('f', bytes.fromhex(payload[52:60]))[0]
          gps_sog = (struct.unpack('B', bytes.fromhex(payload[60:62]))[0])/10 #km/h
          gps_heading = struct.unpack('H', bytes.fromhex(payload[62:66]))[0]

          message_dict['30_min']['gps_time'] = gps_time
          message_dict['30_min']['gps_lat'] = gps_lat
          message_dict['30_min']['gps_lng'] = gps_lng
          message_dict['30_min']['sog'] = gps_sog
          message_dict['30_min']['gps_heading'] = gps_heading
          
        message_dicts.append(message_dict)
      end_time2 = time.time()
      print('DS', end_time2 - start_time2)
        
      print('ALL', (end_time - start_time) + (end_time2 - start_time2) )
      return message_dicts