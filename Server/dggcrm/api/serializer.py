from rest_framework import serializers
from base.models import Person, Group, Event, VolunteerInGroup, Tag, AssignedTag, EventParticipant, Reach, VolunteerResponse, GeneralRole

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class GroupWithAccessSerializer(serializers.Serializer):
    """Serializer for groups with access level included"""
    gid = serializers.IntegerField()
    name = serializers.CharField()
    access_level = serializers.IntegerField()

class PersonWithRelationsSerializer(serializers.ModelSerializer):
    """Serializer for Person with related groups and tags"""
    groups = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['did', 'name', 'email', 'phone', 'groups', 'tags']

    def get_groups(self, obj):
        """Get groups with access levels for this person"""
        volunteer_groups = VolunteerInGroup.objects.filter(person=obj).select_related('group')
        return [
            {
                'gid': vg.group.gid,
                'name': vg.group.name,
                'access_level': vg.access_level
            }
            for vg in volunteer_groups
        ]

    def get_tags(self, obj):
        """Get tags for this person"""
        assigned_tags = AssignedTag.objects.filter(person=obj).select_related('tag')
        return [
            {
                'tid': at.tag.tid,
                'name': at.tag.name
            }
            for at in assigned_tags
        ]

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class VolunteerInGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerInGroup
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class AssignedTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedTag
        fields = '__all__'

class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipant
        fields = '__all__'

class ReachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reach
        fields = '__all__'

class VolunteerResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerResponse
        fields = '__all__'

class GeneralRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralRole
        fields = '__all__'
