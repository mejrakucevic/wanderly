import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { TabLink } from '@/components/ui/tab-link';

export default function MapScreen() {
  return (
    <Screen eyebrow="Wanderly" title="Oh, the places you'll go." description="Big adventures start with a little curiosity.">
      <EmptyState icon="map" title="Your world, waiting to unfold" description="A home for the places you dream of and the ones you never want to forget." note="Your interactive map is coming next." />
      <TabLink href="/trips" label="Explore My Trips" />
    </Screen>
  );
}
