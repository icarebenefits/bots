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
// node-rules
import '/imports/api/node_rules/register-server';
// workplaces
import '/imports/api/facebook/index';
// clients
// B2B
import '/imports/api/clients/b2b';
