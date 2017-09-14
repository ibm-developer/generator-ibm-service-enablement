/*******************************************************************************
 * Copyright (c) 2017 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
package application.ibmcloud;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.PropertySource;


public class Mappings extends PropertySource<Object> {
	private static final Logger LOGGER  = LoggerFactory.getLogger(CloudServices.class);
	
	private CloudServices mappings;
	
	{
		try {
			mappings = CloudServices.MAPPINGS();
		} catch (CloudServicesException e) {
			LOGGER.warn("Error reading mappings file", e);
			mappings = null;
		}
	}
	
	public Mappings() {
		super("CloudServices");
	}
	
	public Mappings(String name) {
		super(name);
	}

	public Mappings(String name, String source) {
		super(name, source);
	}

	
	@Override
	public Object getProperty(String name) {
		if(mappings != null) {
			return mappings.getValue(name);
		}
		return null;
	}
	
}

