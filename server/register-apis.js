/**
 * Register the api with server
 */

/**
 * Collections
 */
// jobs-collection
import '/imports/api/jobs';
// db collections
import '/imports/api/collections/countries/register.server';
import '/imports/api/collections/slas/register.server';
import '/imports/api/collections/workplaces';

/**
 * Fields
 */
// Standard Fields
import '/imports/api/fields';

/**
 * Modules
 */
// workplaces
import '/imports/api/facebook-graph/index.old';

/**
 * Clients
 */
// B2B
import '/imports/api/clients/b2b';
// Elasticsearch
import '/imports/api/elastic';

/**
 * Jobs
 */
import '/imports/api/jobs';

/**
 * Bots
 */
import '/imports/api/bots';

/**
 * Query builder
 */
import '/imports/api/query-builder';

/**
 * OLAP
 */
import '/imports/api/olap';