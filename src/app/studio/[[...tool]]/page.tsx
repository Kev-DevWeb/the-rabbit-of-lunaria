/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 */

import { metadata, viewport } from 'next-sanity/studio'
import StudioLoader from './StudioLoader'

// Set the right metadata and viewport settings
export { metadata, viewport }

export default function StudioPage() {
  return <StudioLoader />
}