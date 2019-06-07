
{
  showGroupAvatar: function() {
    return this.get('thread.isGroupChat') || this.get('thread.isEventChat');
  }.property('thread.isGroupChat', 'thread.isEventChat');

  showMiniProfile: function() {
    return (this.get('isSingleUserChat') || this.get('withMiniProfile')) && !this.get('isInTopMenu');
  }.property('isSingleUserChat', 'withMiniProfile', 'isInTopMenu');

}
