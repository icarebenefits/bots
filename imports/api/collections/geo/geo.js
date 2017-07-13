import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class GEO_SLACollection extends Mongo.Collection {
  insert(doc, callback) {
    // add created and updated Date for document
    doc.createdAt = doc.updatedAt = new Date();
    // add created and updated By if user is logged in
    if(this.userId)
      doc.createdBy = doc.updatedBy = this.userId;

    return super.insert(doc, callback);
  }

  update(selector, modifier) {
    // add the updated Date for document
    if(!modifier['$set']) {
      modifier['$set'] = {};
    }
    modifier['$set'].updatedAt = new Date();
    if(this.userId) {
      modifier['$set'].updatedBy = this.userId;
    }

    return super.update(selector, modifier);
  }
}

// GEO collection
const GEO_SLA = new GEO_SLACollection('geo_sla');

GEO_SLA.schema = new SimpleSchema({
  name: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['field_sales'],
    defaultValue: 'field_sales'
  },
  description: {
    type: String,
    optional: true
  },
  workplace: {
    type: String,
    optional: true
  },
  frequency: {
    type: Object,
    optional: true
  },
  'frequency.preps': {
    type: String,
    optional: true
  },
  'frequency.range': {
    type: String,
    optional: true
  },
  'frequency.unit': {
    type: String,
    optional: true
  },
  'frequency.preps2': {
    type: String,
    optional: true
  },
  'frequency.range2': {
    type: String,
    optional: true
  },
  condition: {
    type: Object,
    optional: true
  },
  "condition.search": {
    type: String,
    optional: true
  },
  "condition.timeRange": {
    type: Object,
    optional: true
  },
  "condition.timeRange.from": {
    type: String,
    optional: true
  },
  "condition.timeRange.to": {
    type: String,
    optional: true
  },
  "condition.timeRange.label": {
    type: String,
    optional: true
  },
  "condition.timeRange.mode": {
    type: String,
    optional: true
  },
  "condition.country": {
    type: String,
    optional: true
  },
  gmap: {
    type: Object,
    optional: true
  },
  "gmap.center": {
    type: Object,
    optional: true
  },
  "gmap.center.lat": {
    type: Number,
    decimal: true,
    optional: true
  },
  "gmap.center.lng": {
    type: Number,
    decimal: true,
    optional: true
  },
  "gmap.zoom": {
    type: Number,
    optional: true
  },
  "gmap.activeMarkerId": {
    type: String,
    optional: true
  },
  "gmap.showPolyline": {
    type: Boolean,
    optional: true
  },
  status: {
    type: String,
    allowedValues: ['draft', 'active', 'inactive'],
    defaultValue: 'draft'
  },
  createdAt: {
    type: Date
  },
  createdBy: {
    type: String,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  updatedBy: {
    type: String,
    optional: true
  },
  lastExecutedAt: {
    type: Date,
    optional: true
  }
});

GEO_SLA.attachSchema(GEO_SLA.schema);

export default GEO_SLA